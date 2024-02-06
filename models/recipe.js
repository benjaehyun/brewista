const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema ({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model defined somewhere
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
    coffeeBeans: {
        type: String,
        required: true
    },
    steps: [{
        type: String
    }],
    flowRate: {
        type: Number,
        default: 0 // Specify your default value here
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
        type: String // Array of strings for tasting notes
    }],
    isTimed: {
        type: Boolean,
        default: false // Boolean to indicate if the recipe is timed
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});


module.exports = mongoose.model('Recipe', recipeSchema);
