const mongoose = require('mongoose')
const Schema = mongoose.Schema



const profileSchema = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true
    }, 
    displayName: {
        type: String, 
        required: false
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