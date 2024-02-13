const User = require('../../models/user')
const Profile = require('../../models/profile')
const profile = require('../../models/profile')
const Relation = require('../../models/relation')

module.exports = {
    getFollowers,
    getFollowing,
    
}


async function getFollowers (req, res) {
    try {
        const profileId = req.params.profileId; 
        const followers = await Relation.find({following: profileId}).populate('follower');
        const followerProfiles = followers.map(relation => relation.follower);
        res.json(followerProfiles)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function getFollowing (req, res) {
    try {
        const profileId = req.params.profileId; 
        const following = await Relation.find({follower: profileId}).populate('following');
        const followingProfiles = following.map(relation => relation.following);
        res.json(followingProfiles)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}