const mongoose = require('mongoose')
const Schema = mongoose.Schema

const grindSizeSchema = new mongoose.Schema({
    steps: {
        type: Number,
        required: true, // assuming every grinder has a basic step scale
        min: 0 // ensures the value is positive
    },
    microsteps: {
        type: Number,
        required: false, // not all grinders will have microsteps
        min: 0 
    },
    description: {
        type: String,
        required: false // optional descriptive text for more detail
    }
});

const recipeSchema = new Schema ({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gear: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gear", 
        required: true
    }],
    coffeeBean: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CoffeeBean"
    },
    grindSize: grindSizeSchema,
    steps: [{
        type: String
    }],
    flowRate: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        enum: ['Ratios', 'Explicit'],
        required: true
    },
    waterTemperature: {
        type: Number, // Adding the water temperature field
        required: false // Assuming it's optional
    },
    journal: {
        type: String,
        required: false // Optional large text field for journaling about the recipe
    },
    tastingNotes: [{
        type: String 
    }],
    isTimed: {
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true 
});


module.exports = mongoose.model('Recipe', recipeSchema);
