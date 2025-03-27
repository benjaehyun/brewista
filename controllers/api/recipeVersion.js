const Recipe = require('../../models/recipe');
const RecipeVersion = require('../../models/recipeVersion');

module.exports = {
    getVersionHistory,
    getSpecificVersion,
    createVersion,
    createBranch,
    copyRecipe,
    isCurrentVersion
};

async function getVersionHistory(req, res) {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const versions = await RecipeVersion.find({ recipeId })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username')
            .lean();

        // Build version tree structure
        const versionTree = await RecipeVersion.getVersionTree(recipeId);
        
        // Add metadata to each version
        const versionsWithMeta = versions.map(version => ({
            ...version,
            isCurrent: version.version === recipe.currentVersion,
            isMainVersion: version.version.endsWith('.0')
        }));

        res.json({
            currentVersion: recipe.currentVersion,
            originalRecipe: recipe.originalRecipeId,
            originalVersion: recipe.originalVersion,
            versions: versionsWithMeta,
            versionTree
        });
    } catch (error) {
        console.error('Error fetching version history:', error);
        res.status(500).json({ error: 'Failed to fetch version history' });
    }
}

async function getSpecificVersion(req, res) {
    try {
        const { id, version } = req.params;
        
        const versionDoc = await RecipeVersion.findOne({
            recipeId: id,
            version
        })
        .populate('createdBy', 'username')
        .populate('recipeData.gear')
        .populate('recipeData.coffeeBean');

        // return additional info in 404 response for debugging and also to be implemented for enhanced error handling in frontend 
        if (!versionDoc) {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            
            const availableVersions = await RecipeVersion.distinct('version', { recipeId: id });
            
            return res.status(404).json({ 
                error: 'The requested version was not found',
                recipeId: id,
                recipeName: recipe.name,
                currentVersion: recipe.currentVersion, 
                requestedVersion: version,
                availableVersions: availableVersions
            });
        }
        // Get recipe metadata
        const recipe = await Recipe.findById(id);
        
        // Check if this is the current version
        const isCurrent = recipe.currentVersion === version;

        res.json({
            ...versionDoc.toObject(),
            isCurrent,
            currentVersion: recipe.currentVersion
        });
    } catch (error) {
        console.error('Error fetching specific version:', error);
        res.status(500).json({ error: 'Failed to fetch version' });
    }
}

async function createVersion(req, res) {
    try {
        const { id } = req.params;
        const { changes, recipeData, sourceVersion } = req.body;
        
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Verify user is recipe owner
        if (recipe.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to create version' });
        }

        // Check if we're editing the current version - only allow main version creation then
        const isEditingCurrentVersion = await RecipeVersion.isCurrentVersion(id, sourceVersion);
        
        if (!isEditingCurrentVersion) {
            return res.status(400).json({ 
                error: 'Cannot create main version from non-current version. Use branch instead.',
                shouldBranch: true
            });
        }

        // Get next main version number
        const nextVersion = await RecipeVersion.getNextMainVersion(id);

        const versionDoc = new RecipeVersion({
            recipeId: id,
            version: nextVersion,
            createdBy: req.user._id,
            changes,
            recipeData
        });

        await versionDoc.save();

        // Update recipe's current version
        recipe.currentVersion = nextVersion;
        await recipe.save();

        res.status(201).json({
            ...versionDoc.toObject(),
            isCurrent: true
        });
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ error: 'Failed to create version' });
    }
}

async function createBranch(req, res) {
    try {
        const { id } = req.params;
        const { parentVersion, changes, recipeData } = req.body;

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Verify user is recipe owner
        if (recipe.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to create branch' });
        }

        // Check if parent is current version - if so, suggest creating main version instead
        const isParentCurrent = await RecipeVersion.isCurrentVersion(id, parentVersion);
        
        if (isParentCurrent) {
            return res.status(400).json({ 
                error: 'Cannot create branch from current version. Use main version instead.',
                shouldUseMain: true 
            });
        }

        // Get next branch version number
        const nextVersion = await RecipeVersion.getNextVersion(id, parentVersion);

        const versionDoc = new RecipeVersion({
            recipeId: id,
            version: nextVersion,
            parentVersion,
            createdBy: req.user._id,
            changes,
            recipeData
        });

        await versionDoc.save();

        res.status(201).json(versionDoc);
    } catch (error) {
        console.error('Error creating branch:', error);
        res.status(500).json({ error: 'Failed to create branch' });
    }
}

async function copyRecipe(req, res) {
    try {
        const { sourceRecipeId, sourceVersion } = req.body;

        // Get source recipe and version
        const sourceRecipe = await Recipe.findById(sourceRecipeId);
        const sourceVersionDoc = await RecipeVersion.findOne({
            recipeId: sourceRecipeId,
            version: sourceVersion
        });

        if (!sourceRecipe || !sourceVersionDoc) {
            return res.status(404).json({ error: 'Source recipe or version not found' });
        }

        // Create new recipe with version data
        const newRecipe = new Recipe({
            ...sourceVersionDoc.recipeData,
            userID: req.user._id,
            originalRecipeId: sourceRecipeId,
            originalVersion: sourceVersion,
            currentVersion: '1.0'
        });

        await newRecipe.save();

        // Create initial version for the copy
        const initialVersion = new RecipeVersion({
            recipeId: newRecipe._id,
            version: '1.0',
            createdBy: req.user._id,
            recipeData: sourceVersionDoc.recipeData,
            changes: [{
                field: 'recipe',
                description: `Copied from ${sourceRecipe.name} v${sourceVersion}`
            }]
        });

        await initialVersion.save();

        res.status(201).json({
            recipe: newRecipe,
            version: initialVersion
        });
    } catch (error) {
        console.error('Error copying recipe:', error);
        res.status(500).json({ error: 'Failed to copy recipe' });
    }
}

async function isCurrentVersion(req, res) {
    try {
        const { id, version } = req.params;
        
        const isCurrent = await RecipeVersion.isCurrentVersion(id, version);
        
        res.json({ isCurrent });
    } catch (error) {
        console.error('Error checking current version:', error);
        res.status(500).json({ error: 'Failed to check version status' });
    }
}