
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
    body: {
        type: String
    },
    service: {
        type: Schema.ObjectId, ref: 'Services'
    },
    trigger: {
        type: Array
    },
    memory: {
        type: Array
    }
})

async function check_response(action, res) {
    const path = action.trigger[1].split('.')
    let data = res.data
    path.forEach((elem) => {data = data[elem]})
    let ret = false
    if (typeof data === 'undefined' || action.memory[0] === "unset")
        return false
    if (action.trigger[0] == "dataChanged")
        if (data != action.memory)
            ret = true
    action.memory = data
    action.save()
    return ret
}

async function get_headers(action) {
    const header = {}
    await action.populate("service")
    action.header.split(',').forEach(element => {
        let data = action.service.appKeys.get(element)
        header[element] = typeof data === 'undefined' ? element : data
    })
    return header
}

Action.methods.check = async function(args) {
    try {
        return await check_response(this, await axios({
            method: this.method,
            url: this.endpointUrl,
            headers: await get_headers(this),
            data: this.body
        }))
    } catch(e)  {
        console.log(e)
    }
}

module.exports = mongoose.model('Action', Action)