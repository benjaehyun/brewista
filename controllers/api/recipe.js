const User = require('../../models/user')
const Recipe = require('../../models/recipe')
const CoffeeBean = require('../../models/coffeeBean')
const Gear = require ('../../models/gear')

module.exports = {
    addRecipe,
    
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