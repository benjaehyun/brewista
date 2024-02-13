const User = require('../../models/user')
const Profile = require('../../models/profile')
const profile = require('../../models/profile')
const Relation = require('../../models/relation')

module.exports = {
    followersIndex,
}


async function followersIndex (req, res) {
    try {
        
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}