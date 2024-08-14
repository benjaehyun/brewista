const User = require('../../models/user')
const Recipe = require('../../models/recipe')
const CoffeeBean = require('../../models/coffeeBean')
const Gear = require ('../../models/gear')

module.exports = {
    addRecipe,
    getCurrentUserRecipes,
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
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCurrentUserRecipes(req, res) {
    try {
        const userId = req.user._id; 
        const recipes = await Recipe.find({ userID: userId })
            .populate('userID', 'username') // Populate with the name of the user
            .populate('coffeeBean') // Populate with the name of the bean
            .sort({ createdAt: -1 }) // Sort by most recent
            .limit(10); 
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error getting recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
}