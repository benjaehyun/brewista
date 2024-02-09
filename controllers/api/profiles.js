const User = require('../../models/user')
const Profile = require('../../models/profile')

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
        const profileData = await Profile.findOne({user:req.user._id}).lean()
        console.log(profileData)
        const user = await User.findById(req.user._id)
        const profile = {
            ...profileData, 
            name: user.name
        }
        console.log(profile)
        res.json(profile)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function update (req, res) {
    try {
        const changes = {}
        console.log(req.body)
        if (req.body.form.name) {
            const user = await User.findByIdAndUpdate(req.user._id, {name: req.body.form.name}, {new:true})
            console.log(`user: ${user}`)
            changes.name = user.name
        }
        if (req.body.form.bio) {
            const profileData = await Profile.findOneAndUpdate({user: req.user._id}, {bio: req.body.form.bio}, {new:true})
            changes.bio = profileData.bio
        }
        console.log(`changes: ${changes}`)
        res.json(changes)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}