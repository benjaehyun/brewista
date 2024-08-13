const User = require('../../models/user')
const Profile = require('../../models/profile')
const Relation = require('../../models/relation')
const Gear = require ('../../models/gear')

module.exports = {
    addRecipe,
    
}


async function addRecipe (req, res) {
    // let {brand, model, modifications, type} = req.body
    // brand = capitalizeFirstLetter(brand)
    try {
        // let gear = await Gear.findOne({ brand, model, modifications });
        // if (!gear) {
        //     gear = new Gear({ brand, model, modifications, type });
        //     await gear.save();
        // }
        // const profile = await Profile.findOne({ user: req.user._id });
        // if (!profile) {
        //     return res.status(404).json({ message: 'Profile not found' });
        // }
        // if (!profile.gear.includes(gear._id)) {
        //     profile.gear.push(gear._id);
        //     await profile.save();
        // }
        // res.status(201).json({ message: 'Gear added to profile successfully', gear });
    } catch (error) {
        // console.error('Error adding gear:', error);
        // res.status(500).json({ message: 'Error adding gear', error });
    }
}