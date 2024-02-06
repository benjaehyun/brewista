const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gearSchema = new Schema ({
    brand: {
        type: String, 
        required: true
    }, 
    model: {
        type: String, 
        required: true
    }, 
    modifications: {
        type: String, 
        required: false
    }, 
    type: {
        type: String,
        required: true,
        enum: ['Brewer', 'Paper', 'Grinder', 'Kettle', 'Scale', 'Other'], 
    }
})

module.exports = mongoose.model('Gear', gearSchema);