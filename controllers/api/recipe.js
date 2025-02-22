const User = require('../../models/user')
const Recipe = require('../../models/recipe')
const Profile = require('../../models/profile')
const CoffeeBean = require('../../models/coffeeBean')
const Gear = require ('../../models/gear')
const RecipeVersion = require('../../models/recipeVersion');


const MAX_USER_RECIPES_PAGES = 200;
const RECIPES_PER_PAGE = 10;

module.exports = {
    addRecipe,
    getCurrentUserRecipes,
    getRecipeById,
    updateRecipe,
    getAllRecipes,
    getSavedRecipes,
}


async function addRecipe(req, res) {
    try {
        const {
            name,
            gear,
            coffeeBean,
            grindSize,
            coffeeAmount,
            waterTemperature,
            waterTemperatureUnit,
            flowRate,
            steps,
            tastingNotes,
            journal,
            type,
        } = req.body;
        const userID = req.user._id;

        if (!name || !gear || !coffeeAmount || !type || !userID) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create the recipe
        const newRecipe = new Recipe({
            userID,
            name,
            gear,
            coffeeBean,
            coffeeAmount,
            grindSize,
            waterTemperature,
            waterTemperatureUnit,
            flowRate,
            steps,
            tastingNotes,
            journal,
            type,
            currentVersion: '1.0'
        });

        const savedRecipe = await newRecipe.save();

        // Create initial version
        const initialVersion = new RecipeVersion({
            recipeId: savedRecipe._id,
            version: '1.0',
            createdBy: userID,
            recipeData: {
                name,
                gear,
                coffeeBean,
                coffeeAmount,
                grindSize,
                waterTemperature,
                waterTemperatureUnit,
                flowRate,
                steps,
                tastingNotes,
                journal,
                type
            },
            changes: [{
                field: 'recipe',
                description: 'Initial version'
            }]
        });

        await initialVersion.save();

        res.status(201).json({
            success: true,
            message: 'Recipe created successfully',
            recipeId: savedRecipe._id
        });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCurrentUserRecipes(req, res) {
    try {
        const userId = req.user._id;
        const page = Math.min(parseInt(req.query.page) || 1, MAX_USER_RECIPES_PAGES);
        const limit = parseInt(req.query.limit) || RECIPES_PER_PAGE;
        const skip = (page - 1) * limit;

        // Get total count of user's recipes
        const totalRecipes = await Recipe.countDocuments({ 
            userID: userId,
            isArchived: false 
        });
        
        if (skip >= totalRecipes) {
            return res.status(200).json({
                recipes: [],
                hasMore: false,
                total: totalRecipes
            });
        }

        const recipes = await Recipe.find({ 
            userID: userId,
            isArchived: false
        })
            .populate('userID', 'username')
            .populate('coffeeBean')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1)
            .lean();

        const hasMore = recipes.length > limit;
        const recipesToSend = hasMore ? recipes.slice(0, -1) : recipes;

        // Fetch current version data and version stats
        const recipesWithVersions = await Promise.all(
            recipesToSend.map(async recipe => {
                const versionDoc = await RecipeVersion.findOne({
                    recipeId: recipe._id,
                    version: recipe.currentVersion
                })
                .populate('recipeData.coffeeBean') 
                .populate('recipeData.gear') 
                .lean();

                const versionStats = await RecipeVersion.aggregate([
                    { $match: { recipeId: recipe._id } },
                    {
                        $group: {
                            _id: null,
                            totalVersions: { $sum: 1 },
                            mainVersions: {
                                $sum: {
                                    $cond: [
                                        { $regexMatch: { input: "$version", regex: /\.0$/ } },
                                        1,
                                        0
                                    ]
                                }
                            },
                            branches: {
                                $sum: {
                                    $cond: [
                                        { $regexMatch: { input: "$version", regex: /\.[1-9][0-9]*$/ } },
                                        1,
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ]);

                return {
                    ...recipe,
                    ...versionDoc.recipeData,
                    versionInfo: {
                        version: versionDoc.version,
                        createdAt: versionDoc.createdAt,
                        createdBy: versionDoc.createdBy,
                        changes: versionDoc.changes,
                        stats: versionStats[0] || {
                            totalVersions: 1,
                            mainVersions: 1,
                            branches: 0
                        }
                    }
                };
            })
        );

        res.status(200).json({
            recipes: recipesWithVersions,
            hasMore,
            total: totalRecipes
        });
    } catch (error) {
        console.error('Error getting recipes:', error);
        res.status(500).json({ 
            error: 'Failed to fetch recipes',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

async function getRecipeById(req, res) {
    try {
        const recipeId = req.params.id;
        const requestedVersion = req.query.version;

        const recipe = await Recipe.findById(recipeId)
            .populate('userID', 'username')
            .lean();

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Get the requested version or current version
        const versionToFetch = requestedVersion || recipe.currentVersion;
        const versionDoc = await RecipeVersion.findOne({
            recipeId,
            version: versionToFetch
        })
        .populate('createdBy', 'username')
        .populate('recipeData.coffeeBean') 
        .populate('recipeData.gear')       // optional
        .lean();

        if (!versionDoc) {
            return res.status(404).json({ error: 'Version not found' });
        }

        // Merge recipe metadata with version data
        const response = {
            ...recipe,
            ...versionDoc.recipeData,
            versionInfo: {
                version: versionDoc.version,
                createdAt: versionDoc.createdAt,
                createdBy: versionDoc.createdBy,
                changes: versionDoc.changes
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// async function updateRecipe (req, res) {
//     const recipe = await Recipe.findById(req.params.id);
  
//     if (recipe) {
//       if (recipe.userID._id.toString() !== req.user._id) {
//         res.status(403);
//         throw new Error('User not authorized to update this recipe');
//       }
  
//       recipe.name = req.body.name || recipe.name;
//       recipe.gear = req.body.gear || recipe.gear;
//       recipe.coffeeBean = req.body.coffeeBean || recipe.coffeeBean;
//       recipe.grindSize = req.body.grindSize || recipe.grindSize;
//       recipe.coffeeAmount = req.body.coffeeAmount || recipe.coffeeAmount;
//       recipe.waterTemperature = req.body.waterTemperature || recipe.waterTemperature;
//       recipe.waterTemperatureUnit = req.body.waterTemperatureUnit || recipe.waterTemperatureUnit;
//       recipe.flowRate = req.body.flowRate || recipe.flowRate;
//       recipe.steps = req.body.steps || recipe.steps;
//       recipe.tastingNotes = req.body.tastingNotes || recipe.tastingNotes;
//       recipe.journal = req.body.journal || recipe.journal;
//       recipe.type = req.body.type || recipe.type;
  
//       const updatedRecipe = await recipe.save();
  
//       res.json({
//         success: true,
//         recipeId: updatedRecipe._id,
//         message: 'Recipe updated successfully'
//       });
//     } else {
//       res.status(404);
//       throw new Error('Recipe not found');
//     }
// }
async function updateRecipe(req, res) {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (recipe.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this recipe' });
        }

        // Get current version data
        const currentVersionDoc = await RecipeVersion.findOne({
            recipeId: recipe._id,
            version: recipe.currentVersion
        });

        // Calculate changes
        const changes = calculateChanges(currentVersionDoc.recipeData, req.body);

        // Get next version number
        const nextVersion = await RecipeVersion.getNextVersion(recipe._id);

        // Create new version
        const newVersion = new RecipeVersion({
            recipeId: recipe._id,
            version: nextVersion,
            createdBy: req.user._id,
            changes,
            recipeData: req.body
        });

        await newVersion.save();

        // Update recipe's current version
        recipe.currentVersion = nextVersion;
        await recipe.save();

        res.json({
            success: true,
            recipeId: recipe._id,
            version: nextVersion,
            message: 'Recipe updated successfully'
        });
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
}

function calculateChanges(oldData, newData) {
    const changes = [];
    const fields = [
        'name', 'coffeeAmount', 'grindSize', 'waterTemperature',
        'waterTemperatureUnit', 'flowRate', 'steps', 'tastingNotes', 'journal'
    ];

    fields.forEach(field => {
        if (JSON.stringify(oldData[field]) !== JSON.stringify(newData[field])) {
            changes.push({
                field,
                oldValue: oldData[field],
                newValue: newData[field],
                description: generateChangeDescription(field, oldData[field], newData[field])
            });
        }
    });
    return changes;
}

function generateChangeDescription(field, oldValue, newValue) {
    switch (field) {
        case 'coffeeAmount':
            return `Changed coffee amount from ${oldValue}g to ${newValue}g`;
        case 'steps':
            return `Modified brewing steps`;
        case 'tastingNotes':
            return `Updated tasting notes`;
        case 'grindSize':
            return `Modified grind settings`;
        default:
            return `Updated ${field}`;
    }
}

async function getAllRecipes(req, res) {
    try {
        const page = Math.min(parseInt(req.query.page) || 1, MAX_USER_RECIPES_PAGES);
        const limit = parseInt(req.query.limit) || RECIPES_PER_PAGE;
        const skip = (page - 1) * limit;

        // Get total count
        const totalRecipes = await Recipe.countDocuments({ isArchived: false });
        
        if (skip >= totalRecipes) {
            return res.status(200).json({
                recipes: [],
                hasMore: false,
                total: totalRecipes
            });
        }

        // Fetch base recipe data
        const recipes = await Recipe.find({ isArchived: false })
            .populate('userID', 'username')
            .populate('coffeeBean')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1)
            .lean();

        const hasMore = recipes.length > limit;
        const recipesToSend = hasMore ? recipes.slice(0, -1) : recipes;

        // Fetch current version data for each recipe
        const recipesWithVersions = await Promise.all(
            recipesToSend.map(async recipe => {
                const versionDoc = await RecipeVersion.findOne({
                    recipeId: recipe._id,
                    version: recipe.currentVersion
                })
                .populate('recipeData.coffeeBean') 
                .populate('recipeData.gear') 
                .lean();

                return {
                    ...recipe,
                    ...versionDoc.recipeData,
                    versionInfo: {
                        version: versionDoc.version,
                        createdAt: versionDoc.createdAt,
                        createdBy: versionDoc.createdBy,
                        changes: versionDoc.changes,
                        hasOtherVersions: await RecipeVersion.countDocuments({
                            recipeId: recipe._id
                        }) > 1
                    }
                };
            })
        );

        res.status(200).json({
            recipes: recipesWithVersions,
            hasMore,
            total: totalRecipes
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ 
            error: 'Failed to fetch recipes',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
}

async function getSavedRecipes(req, res) {
    try {
        const userId = req.user._id;
        const page = Math.min(parseInt(req.query.page) || 1, MAX_USER_RECIPES_PAGES);
        const limit = parseInt(req.query.limit) || RECIPES_PER_PAGE;
        const skip = (page - 1) * limit;

        // Get user's profile to get saved recipe IDs
        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const totalRecipes = profile.savedRecipes.length;
        
        if (skip >= totalRecipes) {
            return res.status(200).json({
                recipes: [],
                hasMore: false,
                total: totalRecipes
            });
        }

        // Get the set of recipe IDs for this page
        const recipeIds = profile.savedRecipes.slice(skip, skip + limit + 1);

        // Fetch base recipe data
        const recipes = await Recipe.find({ 
            _id: { $in: recipeIds },
            isArchived: false
        })
            .populate('userID', 'username')
            .populate('coffeeBean')
            .sort({ createdAt: -1 })
            .lean();

        const hasMore = recipes.length > limit;
        const recipesToSend = hasMore ? recipes.slice(0, -1) : recipes;

        // Fetch current version data for each recipe
        const recipesWithVersions = await Promise.all(
            recipesToSend.map(async recipe => {
                const versionDoc = await RecipeVersion.findOne({
                    recipeId: recipe._id,
                    version: recipe.currentVersion
                })
                .populate('recipeData.coffeeBean') 
                .populate('recipeData.gear') 
                .lean();

                return {
                    ...recipe,
                    ...versionDoc.recipeData,
                    versionInfo: {
                        version: versionDoc.version,
                        createdAt: versionDoc.createdAt,
                        createdBy: versionDoc.createdBy,
                        changes: versionDoc.changes,
                        hasOtherVersions: await RecipeVersion.countDocuments({
                            recipeId: recipe._id
                        }) > 1
                    }
                };
            })
        );

        res.status(200).json({
            recipes: recipesWithVersions,
            hasMore,
            total: totalRecipes
        });
    } catch (error) {
        console.error('Error getting saved recipes:', error);
        res.status(500).json({ 
            error: 'Failed to fetch saved recipes',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}