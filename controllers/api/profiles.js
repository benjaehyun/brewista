const User = require('../../models/user')
const Profile = require('../../models/profile')
const Relation = require('../../models/relation')

module.exports = {
    create, 
    details, 
    update,  
    toggleSavedRecipe,

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
        const profile = await Profile.findOne({user:req.user._id}).lean().populate('gear')
        const followersCount = await Relation.countDocuments({following: profile._id})
        const followingCount = await Relation.countDocuments({follower: profile._id})
        profile.followersCount = followersCount
        profile.followingCount = followingCount
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


async function toggleSavedRecipe(req, res) {
    try {
        const { recipeId } = req.body;
        if (!recipeId) {
            return res.status(400).json({ error: 'Recipe ID is required' });
        }

        const profile = await Profile.findOne({ user: req.user._id });
        
        // Check if recipe is already saved
        const recipeIndex = profile.savedRecipes.indexOf(recipeId);
        
        if (recipeIndex === -1) {
            // Recipe not saved, add it
            profile.savedRecipes.push(recipeId);
        } else {
            // Recipe is saved, remove it
            profile.savedRecipes.splice(recipeIndex, 1);
        }

        // Save the updated profile
        await profile.save();

        // Return the updated profile with follower counts
        const updatedProfile = profile.toObject();
        const followersCount = await Relation.countDocuments({following: profile._id});
        const followingCount = await Relation.countDocuments({follower: profile._id});
        updatedProfile.followersCount = followersCount;
        updatedProfile.followingCount = followingCount;

        res.json(updatedProfile);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
