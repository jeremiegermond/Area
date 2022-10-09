const mongoose = require('mongoose')
const Action = require('./action.js')
const Reaction = require('./reaction.js')
const Schema = mongoose.Schema

const Services = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    appKeys: {
        type : Map
    },
    actions: [{
        type: Schema.ObjectId, ref: 'Action'
    }],
    reactions: [{
        type: Schema.ObjectId, ref: 'Reaction'
    }]
})

module.exports = mongoose.model('Services', Services)