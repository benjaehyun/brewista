const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const bcrypt = require('bcrypt')

module.exports = {
    create, 
    login, 
    checkToken
}

async function create(req, res) {
    try {
        const user = await User.create(req.body);
        const token = createJWT(user);
        res.json(token);
    } catch (error) {
        console.log('User creation error:', error);
        
        if (error.code === 11000) {
            // MongoDB duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                error: `This ${field} is already in use`,
                field: field
            });
        } 
        
        // Validation errors
        if (error.name === 'ValidationError') {
            const fieldErrors = {};
            
            for (const field in error.errors) {
                fieldErrors[field] = error.errors[field].message;
            }
            
            return res.status(400).json({
                error: 'Validation error',
                fields: fieldErrors
            });
        }
        
        res.status(500).json({
            error: 'Failed to create user',
            details: error.message
        });
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const token = createJWT(user);
        res.json(token);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Login failed' });
    }
}

function checkToken(req, res) {
    console.log('req.user', req.user)
    res.json(req.exp)
}

function createJWT (user) {
    return jwt.sign(
        {user}, 
        process.env.SECRET, 
        {expiresIn: '1y'}
    )
}