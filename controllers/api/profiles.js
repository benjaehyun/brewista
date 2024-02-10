const User = require('../../models/user')
const Profile = require('../../models/profile')
const profile = require('../../models/profile')

module.exports = {
    create, 
    details, 
    update,  
}

async function create (req, res) {
    try {
        req.body.user = req.user._id 
        console.log(`req.body: ${req.body}`)
        const profile = await Profile.findOneAndUpdate({user: req.user._id}, req.body, {new: true, upsert: true})
        console.log(`profile: ${profile}`)
        res.json(profile)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function details (req, res) {
    try {
        const profile = await Profile.findOne({user:req.user._id}).lean()
        console.log(profile)
        res.json(profile)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function update (req, res) {
    try {
        const profileData = await Profile.findOneAndUpdate({user: req.user._id}, req.body.form, {new:true})
        res.json(profileData)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}