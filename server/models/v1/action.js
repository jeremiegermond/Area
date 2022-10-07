
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Action = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    endpointUrl: {
        type: String,
    },
    expectedResponse: {
        type: String
    },
    service: {
        type: Schema.ObjectId, ref: 'Services'
    }
})

Action.method.check = async function(args) {
    axios.post(this.endpointUrl, args)
    .then(res => {
        console.log(res);
        console.log(res.data);
    })
}

module.exports = mongoose.model('Action', Action)