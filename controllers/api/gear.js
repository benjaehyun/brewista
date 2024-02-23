const User = require('../../models/user')
const Profile = require('../../models/profile')
const profile = require('../../models/profile')
const Relation = require('../../models/relation')
const Gear = require ('../../models/gear')

module.exports = {
    searchBrands, 
    searchModelsByBrand, 
    searchModificationsByBrandAndModel,
    addGear,
}


async function searchBrands(req, res) {
    let { q = '' } = req.query;
    q = q.trim()
    try {
        // Define the aggregation pipeline
        const pipeline = [
            {
                $match: q ? { brand: { $regex: q, $options: 'i' } } : {}
            },
            {
                $group: { _id: "$brand" }
            },
            {
                $limit: 10
            },
            {
                $sort: { _id: 1 } // Sort alphabetically by brand
            }
        ];

        // Execute the aggregation pipeline
        const brands = await Gear.aggregate(pipeline).exec();

        // Map the results to return an array of brand names
        const brandNames = brands.map(b => b._id);

        res.json(brandNames);
    } catch (err) {
        console.error(err); // Use console.error for better error logging
        res.status(400).json({ message: 'Error fetching brands', error: err });
    }
}


async function searchModelsByBrand(req, res) {
    let { brand, q = '' } = req.query;
    q = q.trim()
    try {
        const pipeline = [
            {
                $match: { 
                    brand,
                    ...(q && { model: { $regex: q, $options: 'i' } }) // Conditionally add model filter if q is provided
                }
            },
            {
                $group: { _id: "$model" }
            },
            {
                $limit: 10
            },
            {
                $sort: { _id: 1 } // Sort alphabetically by model
            }
        ];

        const models = await Gear.aggregate(pipeline).exec();
        const modelNames = models.map(m => m._id);

        res.json(modelNames);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error fetching models', error: err });
    }
}


async function searchModificationsByBrandAndModel(req, res) {
    let { brand, model, q = '' } = req.query;
    q = q.trim()
    try {
        const pipeline = [
            {
                $match: {
                    brand,
                    model,
                    ...(q && { modifications: { $regex: q, $options: 'i' } }) // Conditionally add modifications filter if q is provided
                }
            },
            {
                $group: { _id: "$modifications" }
            },
            {
                $limit: 10
            },
            {
                $sort: { _id: 1 } // Optionally sort the modifications alphabetically
            }
        ];

        const modifications = await Gear.aggregate(pipeline).exec();
        const modificationList = modifications.map(m => m._id);

        res.json(modificationList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching modifications', error });
    }
}


async function addGear (req, res) {
    const {brand, model, modifications, type} = req.body
    try {
        let gear = await Gear.findOne({ brand, model, modifications });
        if (!gear) {
            gear = new Gear({ brand, model, modifications, type });
            await gear.save();
        }
        const profile = await Profile.findOne({ user: req.user._id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        if (!profile.gear.includes(gear._id)) {
            profile.gear.push(gear._id);
            await profile.save();
        }
        res.status(201).json({ message: 'Gear added to profile successfully', gear });
    } catch (error) {
        console.error('Error adding gear:', error);
        res.status(500).json({ message: 'Error adding gear', error });
    }
}
