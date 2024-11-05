const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const bcrypt = require('bcrypt')

module.exports = {
    create, 
    login, 
    checkToken
}

async function create (req, res) {
    try {
        const user = await User.create(req.body)
        const token = createJWT(user)
        res.json(token)
    } catch (error) {
        console.log('User creation error:', error); // More detailed error logging
        console.log('Error code:', error.code);
        console.log('Error keyPattern:', error.keyPattern);
        console.log('Error keyValue:', error.keyValue);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            console.log('Duplicate field:', field); // Debug log
            res.status(400).json({
                error: `${field} already exists`,
                field: field
            });
        } else {
            res.status(500).json({
                error: 'Failed to create user',
                details: error.message
            })
        }
    }
}

async function login (req, res) {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) throw new Error()
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) throw new Error()
        const token = createJWT(user)
        res.json(token)
    } catch (err) {
        console.log(err)
        res.status(400).json('Bad Credentials')
    }
}

function checkToken(req, res) {
    console.log('req.user', req.user)
    res.json(req.exp)
}

// Helper function 
function createJWT (user) {
    return jwt.sign(
        {user}, 
        process.env.SECRET, 
        {expiresIn: '24h'}
    )
}