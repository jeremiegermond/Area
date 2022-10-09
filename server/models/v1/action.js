
const mongoose = require('mongoose')
const axios =  require('axios')
const Schema = mongoose.Schema

const Action = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    method: {
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

Action.methods.check = async function(args) {
    try {
        axios.get(this.endpointUrl, args)
        .then(res => {
            console.log(`response: ${res.status} expected: ${this.expectedResponse}`);
            if (res.status == this.expectedResponse)
                console.log("reaction")
            else
                console.log(`${res.status} isn't the expected response to trigger reaction`)
        })
    } catch(e)  {
        console.log(e)
    }
}

module.exports = mongoose.model('Action', Action)