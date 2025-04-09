const User = require('../../models/user')
const Recipe = require('../../models/recipe')
const Profile = require('../../models/profile')
const CoffeeBean = require('../../models/coffeeBean')
const Gear = require ('../../models/gear')
const RecipeVersion = require('../../models/recipeVersion');
const { ObjectId } = require('mongodb');

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
            currentVersion: '1.0',
            currentVersionCreatedAt: new Date()
        });

        const savedRecipe = await newRecipe.save();

        // Create initial version
        const initialVersion = new RecipeVersion({
            recipeId: savedRecipe._id,
            version: '1.0',
            createdBy: userID,
            createdAt: savedRecipe.currentVersionCreatedAt,
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

        const aggregatedRecipes = await Recipe.aggregate([
            // Filter for user's non-archived recipes
            { $match: { 
                userID: new ObjectId(userId),
                isArchived: false 
            }},
            
            // Sort by creation date
            { $sort: { currentVersionCreatedAt: -1 } },
            
            // Pagination
            { $skip: skip },
            { $limit: limit + 1 },

            // Lookup user information (username)
            { $lookup: {
                from: 'users',
                localField: 'userID',
                foreignField: '_id',
                pipeline: [{ $project: { username: 1 } }],
                as: 'userDetails'
            }},
            
            // Lookup current version data
            { $lookup: {
                from: 'recipeversions',
                let: { recipeId: '$_id', version: '$currentVersion' },
                pipeline: [
                    { $match: { 
                        $expr: { 
                            $and: [
                                { $eq: ['$recipeId', '$$recipeId'] },
                                { $eq: ['$version', '$$version'] }
                            ]
                        }
                    }},
                    // Only select what we need from recipeData
                    { $project: {
                        version: 1,
                        createdAt: 1,
                        createdBy: 1,
                        changes: 1,
                        'recipeData.name': 1,
                        'recipeData.type': 1,
                        'recipeData.coffeeAmount': 1,
                        'recipeData.coffeeBean': 1,
                        'recipeData.tastingNotes': 1,
                        'recipeData.steps.waterAmount': 1, // Only need waterAmount from steps
                    }},
                ],
                as: 'versionData'
            }},
            
            // Lookup coffee bean data
            { $lookup: {
                from: 'coffeebeans',
                let: { beanId: { $arrayElemAt: ['$versionData.recipeData.coffeeBean', 0] } },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$beanId'] } }},
                    { $project: {
                        roaster: 1,
                        origin: 1,
                        roastLevel: 1,
                        process: 1
                    }}
                ],
                as: 'coffeeBeanData'
            }},
            
            
            // Reshape for final output
            { $project: {
                _id: 1,
                createdAt: 1,
                userID: { $arrayElemAt: ['$userDetails', 0] },
                
                // Recipe data
                name: { $arrayElemAt: ['$versionData.recipeData.name', 0] },
                type: { $arrayElemAt: ['$versionData.recipeData.type', 0] },
                coffeeAmount: { $arrayElemAt: ['$versionData.recipeData.coffeeAmount', 0] },
                coffeeBean: { $arrayElemAt: ['$coffeeBeanData', 0] },
                tastingNotes: { $arrayElemAt: ['$versionData.recipeData.tastingNotes', 0] },
                steps: { $arrayElemAt: ['$versionData.recipeData.steps', 0] },
                
                // Version info
                versionInfo: {
                    version: { $arrayElemAt: ['$versionData.version', 0] },
                    createdAt: { $arrayElemAt: ['$versionData.createdAt', 0] },
                    createdBy: { $arrayElemAt: ['$versionData.createdBy', 0] },
                    changes: { $arrayElemAt: ['$versionData.changes', 0] },
                }
            }}
        ]);

        const hasMore = aggregatedRecipes.length > limit;
        const recipes = hasMore ? aggregatedRecipes.slice(0, -1) : aggregatedRecipes;

        res.status(200).json({
            recipes,
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
        .populate('recipeData.gear')       // optional, could remove
        .lean();

        // Improved error handling for missing versions to be better handled in frontend
        if (!versionDoc) {
            return res.status(404).json({ 
                error: 'The requested version was not found',
                currentVersion: recipe.currentVersion, 
                requestedVersion: requestedVersion,
                availableVersions: await RecipeVersion.distinct('version', { recipeId })
            });
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

        const now = new Date();
        // Create new version
        const newVersion = new RecipeVersion({
            recipeId: recipe._id,
            version: nextVersion,
            createdBy: req.user._id,
            createdAt: now,
            changes,
            recipeData: req.body
        });

        await newVersion.save();

        // Update recipe's current version
        recipe.currentVersion = nextVersion;
        recipe.currentVersionCreatedAt = now;
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
            if (oldValue?.steps !== newValue?.steps) {
                return `Changed grind size from ${oldValue?.steps || 0} to ${newValue?.steps || 0} steps`;
            }
            return `Modified grind settings`;
        case 'waterTemperature':
            return `Changed water temperature from ${oldValue}° to ${newValue}°`;
        case 'name':
            return `Renamed from "${oldValue}" to "${newValue}"`;
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

        // new aggregation pipeline
        const aggregatedRecipes = await Recipe.aggregate([
            // Filter for non-archived recipes
            { $match: { isArchived: false } },
            
            // Sort by creation date
            { $sort: { currentVersionCreatedAt: -1 } },
            
            // pagination
            { $skip: skip },
            { $limit: limit + 1 },
            
            // Look up user information (just username)
            { $lookup: {
                from: 'users',
                localField: 'userID',
                foreignField: '_id',
                pipeline: [{ $project: { username: 1 } }],
                as: 'userDetails'
            }},
            
            // Look up current version with minimal fields
            { $lookup: {
                from: 'recipeversions',
                let: { recipeId: '$_id', version: '$currentVersion' },
                pipeline: [
                    { $match: { 
                        $expr: { 
                            $and: [
                                { $eq: ['$recipeId', '$$recipeId'] },
                                { $eq: ['$version', '$$version'] }
                            ]
                        }
                    }},
                    // Only select what we need from recipeData
                    { $project: {
                        version: 1,
                        createdAt: 1,
                        createdBy: 1,
                        changes: 1,
                        'recipeData.name': 1,
                        'recipeData.type': 1,
                        'recipeData.coffeeAmount': 1,
                        'recipeData.coffeeBean': 1,
                        'recipeData.tastingNotes': 1,
                        'recipeData.steps.waterAmount': 1 // Only need waterAmount from steps
                    }},
                ],
                as: 'versionData'
            }},
            
            // Look up coffee bean data (only what's needed)
            { $lookup: {
                from: 'coffeebeans',
                let: { beanId: { $arrayElemAt: ['$versionData.recipeData.coffeeBean', 0] } },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$beanId'] } }},
                    { $project: {
                        roaster: 1,
                        origin: 1,
                        roastLevel: 1,
                        process: 1
                    }}
                ],
                as: 'coffeeBeanData'
            }},
            
            // Reshape for final output
            { $project: {
                _id: 1,
                createdAt: 1,
                userID: { $arrayElemAt: ['$userDetails', 0] },
                
                // Recipe data
                name: { $arrayElemAt: ['$versionData.recipeData.name', 0] },
                type: { $arrayElemAt: ['$versionData.recipeData.type', 0] },
                coffeeAmount: { $arrayElemAt: ['$versionData.recipeData.coffeeAmount', 0] },
                coffeeBean: { $arrayElemAt: ['$coffeeBeanData', 0] },
                tastingNotes: { $arrayElemAt: ['$versionData.recipeData.tastingNotes', 0] },
                steps: { $arrayElemAt: ['$versionData.recipeData.steps', 0] },
                
                // Version info
                versionInfo: {
                    version: { $arrayElemAt: ['$versionData.version', 0] },
                    createdAt: { $arrayElemAt: ['$versionData.createdAt', 0] },
                    createdBy: { $arrayElemAt: ['$versionData.createdBy', 0] },
                    changes: { $arrayElemAt: ['$versionData.changes', 0] },
                }
            }}
        ]);

        const hasMore = aggregatedRecipes.length > limit;
        const recipes = hasMore ? aggregatedRecipes.slice(0, -1) : aggregatedRecipes;

        res.status(200).json({
            recipes,
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

        // Get the set of recipe IDs for this page || maybe refactor pagination method
        const recipeIds = profile.savedRecipes.slice(skip, skip + limit + 1);

        const aggregatedRecipes = await Recipe.aggregate([
            // Match saved recipes for this page
            { $match: { 
                _id: { $in: recipeIds },
                isArchived: false 
            }},
            
            // Sort by creation date
            { $sort: { currentVersionCreatedAt: -1 } },
            
            // Lookup user information (username)
            { $lookup: {
                from: 'users',
                localField: 'userID',
                foreignField: '_id',
                pipeline: [{ $project: { username: 1 } }],
                as: 'userDetails'
            }},
            
            // Lookup current version data
            { $lookup: {
                from: 'recipeversions',
                let: { recipeId: '$_id', version: '$currentVersion' },
                pipeline: [
                    { $match: { 
                        $expr: { 
                            $and: [
                                { $eq: ['$recipeId', '$$recipeId'] },
                                { $eq: ['$version', '$$version'] }
                            ]
                        }
                    }},
                    // Only select what we need from recipeData
                    { $project: {
                        version: 1,
                        createdAt: 1,
                        createdBy: 1,
                        changes: 1,
                        'recipeData.name': 1,
                        'recipeData.type': 1,
                        'recipeData.coffeeAmount': 1,
                        'recipeData.coffeeBean': 1,
                        'recipeData.tastingNotes': 1,
                        'recipeData.steps.waterAmount': 1, // Only need waterAmount from steps
                    }},
                ],
                as: 'versionData'
            }},
            
            // Lookup coffee bean data
            { $lookup: {
                from: 'coffeebeans',
                let: { beanId: { $arrayElemAt: ['$versionData.recipeData.coffeeBean', 0] } },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$beanId'] } }},
                    { $project: {
                        roaster: 1,
                        origin: 1,
                        roastLevel: 1,
                        process: 1
                    }}
                ],
                as: 'coffeeBeanData'
            }},
            
            
            // Reshape for final output
            { $project: {
                _id: 1,
                createdAt: 1,
                userID: { $arrayElemAt: ['$userDetails', 0] },
                
                // Recipe data
                name: { $arrayElemAt: ['$versionData.recipeData.name', 0] },
                type: { $arrayElemAt: ['$versionData.recipeData.type', 0] },
                coffeeAmount: { $arrayElemAt: ['$versionData.recipeData.coffeeAmount', 0] },
                coffeeBean: { $arrayElemAt: ['$coffeeBeanData', 0] },
                tastingNotes: { $arrayElemAt: ['$versionData.recipeData.tastingNotes', 0] },
                steps: { $arrayElemAt: ['$versionData.recipeData.steps', 0] },
                
                // Version info
                versionInfo: {
                    version: { $arrayElemAt: ['$versionData.version', 0] },
                    createdAt: { $arrayElemAt: ['$versionData.createdAt', 0] },
                    createdBy: { $arrayElemAt: ['$versionData.createdBy', 0] },
                    changes: { $arrayElemAt: ['$versionData.changes', 0] },
                }
            }}
        ]);

        const hasMore = aggregatedRecipes.length > limit;
        const recipes = hasMore ? aggregatedRecipes.slice(0, -1) : aggregatedRecipes;

        res.status(200).json({
            recipes,
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