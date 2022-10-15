
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

async function check_trigger(action, res, data) {
    if (typeof data === 'undefined')
        return false
    switch (action.trigger[0]) {
        case "dataChanged":
            if (data != action.memory && action.memory[0] !== "unset")
                return true
            break
        case "dataIs":
            if (data === action.trigger[2])
                return true
            break
        case "dataHas":
            if (~data.indexOf(action.trigger[2]))
                return true
            break
        case "codeChanged":
            if (String(res.status) != action.memory && action.memory[0] !== "unset")
                return true
            break
        case "codeIs":
            if (String(res.status) === action.trigger[1])
                return true
            break
        case "codeHas":
            if (~String(res.status).indexOf(action.trigger[1]))
                return true
            break
        default:
            return false
    }
    return false
}

async function check_response(action, res) {
    let data = res.data
    if (~action.trigger[0].indexOf("data"))
        action.trigger[1].split('.').forEach((elem) => {data = data[elem]})
    else 
        data = res.status
    let ret = await check_trigger(action, res, data)
    action.memory = data
    action.save()
    return ret
}

async function get_headers(action) {
    const header = {}
    await action.populate("service")
    action.header.split(',').forEach(element => {
        let data = action.service.appKeys.get(element)
        header[element] = typeof data === 'undefined' ? element: data
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