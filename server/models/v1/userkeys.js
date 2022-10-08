const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserKeys = new Schema({
    service: {
        type: String,
        required: [true, 'Service name is required'],
    },
    public_key: {
        type: String,
        required: [true, 'Public key is required'],
    },
    private_key: {
        type: String,
        required: [true, 'Private key is required'],
    }
})

module.exports = mongoose.model('UserKeys', UserKeys)