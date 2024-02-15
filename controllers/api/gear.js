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
    const { q = '' } = req.query;
    let brands;
    try {
        if (q) {
        brands = await Gear.find({ brand: { $regex: q, $options: 'i' } }).distinct('brand').limit(10);
     } else {
        brands = await Gear.distinct('brand').limit(10);
        }
        res.json(brands);
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function searchModelsByBrand (req, res) {
    const { brand, q = '' } = req.query;
    let models;
    try {
        if (q) {
        models = await Gear.find({ brand, model: { $regex: q, $options: 'i' } }).distinct('model').limit(10);
        } else {
        models = await Gear.find({ brand }).distinct('model').limit(10);
        }
        res.json(models);
    } catch (err) {
        res.status(400).json(err)
    }
}

async function searchModificationsByBrandAndModel (req, res) {
    const { brand, model, q = '' } = req.query;
    let modifications;
    try {
        const query = { brand, model };
        if (q) query.modifications = { $regex: q, $options: 'i' };
        modifications = await Gear.find(query, 'modifications -_id').limit(10);
        res.json(modifications.map(item => item.modifications));
    } catch (error) {
     res.status(500).json({ message: 'Error fetching modifications', error });
    }
}

async function addGear (req, res) {
    const {brand, model, modifications, type} = req.body
    try {
        const existingGear = await Gear.findOne({brand, model}); 
        if (existingGear) {
            return res.status(400).json({message: 'Gear already exists'})
        }
        const newGear = new Gear ({brand, model, modifications, type}); 
        await newGear.save()
        res.status(201).json(newGear)
    } catch (err) {
        res.status(500).json({message: 'Error adding gear', error})
    }
}
