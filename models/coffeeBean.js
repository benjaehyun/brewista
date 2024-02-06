// Decided for a separate model so that beans can be a separate entity for futureproofing new features ie recipe searches based on coffee 

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coffeeBeanSchema = new Schema ({
    roaster: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    roastLevel: {
        type: String,
        required: true // Consider standardizing this with an enum array of roast levels or using a numeric scale
    },
    process: {
        type: String,
        required: false // Making this optional as not all beans may specify the process
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('CoffeeBean', coffeeBeanSchema);