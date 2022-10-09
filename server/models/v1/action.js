
const axios =  require('axios')
const Service = require('./services')
const mongoose = require('mongoose')
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
    header: {
        type: String
    },
    expectedResponse: {
        type: String
    },
    service: {
        type: Schema.ObjectId, ref: 'Services'
    }
})

function check_response(action, res) {
    const key = action.expectedResponse.substr(0, action.expectedResponse.indexOf(':'))
    const expected_r = action.expectedResponse.substr(action.expectedResponse.indexOf(':') + 1)
    if (key == "is") {
        if (res.data == expected_r)
            console.log("is")
    } else if (key == "has") {
        if (res.indexOf(expected_r) >= 0)
            console.log("has")
    } else if (key == "code") {
        if (res.status == expected_r)
            return true
    } else
        console.log(`unknown code ${key}`)
    return false
    //if (res.status == action.expectedResponse)
    //    console.log("reaction")
    //else
    //    console.log(`${res.status} isn't the expected response to trigger reaction`)
}

function set(action, args) {
    axios.set(action.endpointUrl, args)
    .then(res => {
        console.log(`response: ${res.status} expected: ${action.expectedResponse}`);
        return check_response(action, res)
    })
}

function get(action, args) {
    console.log("get", args)
    axios.get(action.endpointUrl, args)
    .then(res => {
        console.log(`response: ${res.status} expected: ${action.expectedResponse}`);
        return check_response(action, res)
    })
}

Action.methods.check = async function(args) {
    try {
        const header = {headers: {}}
        this.populate("service").then(() => {
            this.header.split(',').forEach(element => {
                header.headers[element] = this.service.appKeys.get(element)
            });
            console.log(header)
            if (this.method == "set")
                return set(this, header)
            else if (this.method == "get")
                return get(this, header)
            else
                console.log(`Unknown method ${this.method}`)
        })
    } catch(e)  {
        console.log(e)
    }
}

module.exports = mongoose.model('Action', Action)