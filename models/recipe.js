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

const stepSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    time: {
        type: Number, // Time in seconds
        required: false // Making it optional allows for ratio-based steps without specific timing
    },
    isBloom: {
        type: Boolean,
        default: false // Most steps aren't bloom phases, so default to false
    },
    // Consider adding water amount here if you want to specify amounts per step
    // This could be useful for both ratio and explicit recipes
    // Can probably take out the isTimed component and can check for it in the front-end handling. 
    waterAmount: {
        type: Number, // Water in milliliters or as part of a ratio
        required: false
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
    coffeeAmount: {
        type: Number,
        required: true 
    },
    grindSize: grindSizeSchema,
    steps: [stepSchema],
    flowRate: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        enum: ['Ratio', 'Explicit'],
        required: true
    },
    waterTemperature: {
        type: Number, // Adding the water temperature field
        required: false // Assuming it's optional
    },
    waterTemperatureUnit: {
        type: String,
        enum: ['Celsius', 'Fahrenheit', null],
        required: false // This field is optional and only needed if waterTemperature is provided
    },    
    journal: {
        type: String,
        required: false // Optional large text field for journaling about the recipe
    },
    tastingNotes: [{
        type: String 
    }],
    originalRecipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      originalVersion: String,
      currentVersion: {
        type: String,
        default: '1.0'
      },
      isArchived: {
        type: Boolean,
        default: false
      }
}, {
    timestamps: true 
});


// method to get full version history
recipeSchema.methods.getVersionHistory = async function() {
    return await RecipeVersion.find({ recipeId: this._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
  };
  
// method to get specific version
recipeSchema.methods.getVersion = async function(version) {
    return await RecipeVersion.findOne({ 
        recipeId: this._id,
        version 
    }).populate('createdBy', 'username');
};

module.exports = mongoose.model('Recipe', recipeSchema);
