const User = require('../../models/user')
const Profile = require('../../models/profile')
const CoffeeBean = require ('../../models/coffeeBean')

module.exports = {
    searchRoasters, 
    searchOriginsByRoasters, 
    searchRoastLevelsByRoasterAndOrigin,
    searchProcessesByRoasterOriginAndRoastLevel,
    addBean,
};


async function searchRoasters(req, res) {
    let { q = '' } = req.query;
    q = q.trim();
    try {
        const pipeline = [
            {
                $match: q ? { roaster: { $regex: q, $options: 'i' } } : {}
            },
            {
                $group: { _id: "$roaster" }
            },
            {
                $limit: 10
            },
            {
                $sort: { _id: 1 }
            }
        ];

        const roasters = await CoffeeBean.aggregate(pipeline).exec();
        const roasterNames = roasters.map(r => r._id);

        res.json(roasterNames);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error fetching roasters', error: err });
    }
}

async function searchOriginsByRoasters(req, res) {
    let { roaster, q = '' } = req.query;
    q = q.trim();
    try {
        const pipeline = [
            {
                $match: {
                    roaster,
                    ...(q && { origin: { $regex: q, $options: 'i' } })
                }
            },
            {
                $group: { _id: "$origin" }
            },
            {
                $limit: 10
            },
            {
                $sort: { _id: 1 }
            }
        ];

        const origins = await CoffeeBean.aggregate(pipeline).exec();
        const originNames = origins.map(o => o._id);

        res.json(originNames);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error fetching origins', error: err });
    }
}

async function searchRoastLevelsByRoasterAndOrigin(req, res) {
    let { roaster, origin, q = '' } = req.query;
    q = q.trim();
    try {
        const pipeline = [
            {
                $match: {
                    roaster,
                    origin,
                    ...(q && { roastLevel: { $regex: q, $options: 'i' } })
                }
            },
            {
                $group: { _id: "$roastLevel" }
            },
            {
                $limit: 10
            },
            {
                $sort: { _id: 1 }
            }
        ];

        const roastLevels = await CoffeeBean.aggregate(pipeline).exec();
        const roastLevelNames = roastLevels.map(rl => rl._id);

        res.json(roastLevelNames);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error fetching roast levels', error: err });
    }
}

async function searchProcessesByRoasterOriginAndRoastLevel(req, res) {
    let { roaster, origin, roastLevel, q = '' } = req.query;
    q = q.trim();
    try {
        const pipeline = [
            {
                $match: {
                    roaster,
                    origin,
                    roastLevel,
                    ...(q && { process: { $regex: q, $options: 'i' } })
                }
            },
            {
                $group: { _id: "$process" }
            },
            {
                $limit: 10
            },
            {
                $sort: { _id: 1 }
            }
        ];

        const processes = await CoffeeBean.aggregate(pipeline).exec();
        const processNames = processes.map(p => p._id);

        res.json(processNames);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error fetching processes', error: err });
    }
}



async function addBean(req, res) {
    try {
        const { roaster, origin, roastLevel, process } = req.body;
        const newBean = new CoffeeBean({ roaster, origin, roastLevel, process });
        await newBean.save();
        res.status(201).json(newBean);
    } catch (error) {
        console.error('Failed to add coffee bean:', error);
        res.status(400).json({ error: 'Failed to add coffee bean' });
    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }