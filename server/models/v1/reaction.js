
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Reaction = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    endpointUrl: {
        type: String,
    },
    service: {
        type: Schema.ObjectId, ref: 'Services'
    }
})

Reaction.method.exec = async function(args) {
    axios.post(this.endpointUrl, args)
    .then(res => {
        console.log(res);
        console.log(res.data);
    })
}

module.exports = mongoose.model('Reaction', Reaction)