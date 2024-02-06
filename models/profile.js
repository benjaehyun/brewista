const mongoose = require('mongoose')
const Schema = mongoose.Schema



const profileSchema = new Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true
    }, 
    bio: {
        type: String, 
        required: false
    }, 
    gear: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Gear"
    }], 
    savedRecipes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Recipe"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Profile', profileSchema);