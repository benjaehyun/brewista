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
    } catch (error) { // Needs to be refactored to return the correct field
        console.log(error)
        if (error.code === 11000) { // MongoDB duplicate key error
            const field = Object.keys(error.keyPattern)[0]; // 'username' or 'email'
            res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
          } else {
            res.status(500).json({ error: 'Internal server error' });
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