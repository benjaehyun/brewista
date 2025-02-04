const Recipe = require('../../models/recipe');
const RecipeVersion = require('../../models/recipeVersion');

module.exports = {
    getVersionHistory,
    getSpecificVersion,
    createVersion,
    createBranch,
    copyRecipe
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
        const versionTree = versions.map(version => ({
            ...version,
            isCurrent: version.version === recipe.currentVersion,
            isMainVersion: version.version.endsWith('.0')
        }));

        res.json({
            currentVersion: recipe.currentVersion,
            originalRecipe: recipe.originalRecipeId,
            originalVersion: recipe.originalVersion,
            versions: versionTree
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

        if (!versionDoc) {
            return res.status(404).json({ error: 'Version not found' });
        }

        res.json(versionDoc);
    } catch (error) {
        console.error('Error fetching specific version:', error);
        res.status(500).json({ error: 'Failed to fetch version' });
    }
}

async function createVersion(req, res) {
    try {
        const { id } = req.params;
        const { changes, recipeData } = req.body;
        
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // check if current user is recipe owner
        if (recipe.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to create version' });
        }

        // Get next main version number
        const nextVersion = await RecipeVersion.getNextVersion(id);

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

        res.status(201).json(versionDoc);
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