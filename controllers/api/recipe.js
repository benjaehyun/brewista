const User = require('../../models/user')
const Recipe = require('../../models/recipe')
const Profile = require('../../models/profile')
const CoffeeBean = require('../../models/coffeeBean')
const Gear = require ('../../models/gear')

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
        const userID = req.user._id
        if (!name || !gear || !coffeeAmount || !type || !userID) {
            return res.status(400).json({ error: "Missing required fields" });
        }
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
            type
        });
        const savedRecipe = await newRecipe.save();
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

        // Get total count of user's recipes first
        const totalRecipes = await Recipe.countDocuments({ userID: userId });
        
        // Don't fetch if we're beyond possible pages
        if (skip >= totalRecipes) {
            return res.status(200).json({
                recipes: [],
                hasMore: false,
                total: totalRecipes
            });
        }

        const recipes = await Recipe.find({ userID: userId })
            .populate('userID', 'username')
            .populate('coffeeBean')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1)
            .lean();

        const hasMore = recipes.length > limit;
        const recipesToSend = hasMore ? recipes.slice(0, -1) : recipes;

        res.status(200).json({
            recipes: recipesToSend,
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

        const recipe = await Recipe.findById(recipeId)
            .populate('userID', 'username') // Populate the userID with username field
            .populate('coffeeBean', 'roaster origin roastLevel process') // Populate coffeeBean with relevant fields
            .populate('gear', 'brand model modifications type'); // Populate coffeeBean with relevant fields

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateRecipe (req, res) {
    const recipe = await Recipe.findById(req.params.id);
  
    if (recipe) {
      if (recipe.userID._id.toString() !== req.user._id) {
        res.status(403);
        throw new Error('User not authorized to update this recipe');
      }
  
      recipe.name = req.body.name || recipe.name;
      recipe.gear = req.body.gear || recipe.gear;
      recipe.coffeeBean = req.body.coffeeBean || recipe.coffeeBean;
      recipe.grindSize = req.body.grindSize || recipe.grindSize;
      recipe.coffeeAmount = req.body.coffeeAmount || recipe.coffeeAmount;
      recipe.waterTemperature = req.body.waterTemperature || recipe.waterTemperature;
      recipe.waterTemperatureUnit = req.body.waterTemperatureUnit || recipe.waterTemperatureUnit;
      recipe.flowRate = req.body.flowRate || recipe.flowRate;
      recipe.steps = req.body.steps || recipe.steps;
      recipe.tastingNotes = req.body.tastingNotes || recipe.tastingNotes;
      recipe.journal = req.body.journal || recipe.journal;
      recipe.type = req.body.type || recipe.type;
  
      const updatedRecipe = await recipe.save();
  
      res.json({
        success: true,
        recipeId: updatedRecipe._id,
        message: 'Recipe updated successfully'
      });
    } else {
      res.status(404);
      throw new Error('Recipe not found');
    }
}

async function getAllRecipes(req, res) {
    try {
        const page = Math.min(parseInt(req.query.page) || 1, MAX_USER_RECIPES_PAGES);
        const limit = parseInt(req.query.limit) || RECIPES_PER_PAGE;
        const skip = (page - 1) * limit;

        // Get total count
        const totalRecipes = await Recipe.countDocuments({});
        
        // Don't fetch if we're beyond possible pages
        if (skip >= totalRecipes) {
            return res.status(200).json({
                recipes: [],
                hasMore: false,
                total: totalRecipes
            });
        }

        const recipes = await Recipe.find({})
            .populate('userID', 'username')
            .populate('coffeeBean')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1)
            .lean();

        const hasMore = recipes.length > limit;
        const recipesToSend = hasMore ? recipes.slice(0, -1) : recipes;

        res.status(200).json({
            recipes: recipesToSend,
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

        // Get total count of saved recipes
        const totalRecipes = profile.savedRecipes.length;
        
        // Don't fetch if we're beyond possible pages
        if (skip >= totalRecipes) {
            return res.status(200).json({
                recipes: [],
                hasMore: false,
                total: totalRecipes
            });
        }

        // Get the set of recipe IDs for this page
        const recipeIds = profile.savedRecipes.slice(skip, skip + limit + 1);

        // Fetch the actual recipes
        const recipes = await Recipe.find({ _id: { $in: recipeIds } })
            .populate('userID', 'username')
            .populate('coffeeBean')
            .sort({ createdAt: -1 })
            .lean();

        const hasMore = recipes.length > limit;
        const recipesToSend = hasMore ? recipes.slice(0, -1) : recipes;

        res.status(200).json({
            recipes: recipesToSend,
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