// model used to track users' following and follower list detached from the user/profile models 
// this solution was used for scalabiltiy and to keep the profile doc lean 

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const relationSchema = new Schema ({
    follower: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile', 
        required: true
    }, 
    following: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Profile",
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Relation', relationSchema);