
const axios = require('axios')
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
    },
    userKey: {
        type: Boolean
    }
})

async function check_trigger(trig, memory, res, data) {
    if (typeof data === 'undefined')
        return false
    switch (trig[0]) {
        case "dataChanged":
            if (data != memory && memory[0] !== "unset")
                return true
            break
        case "dataIs":
            if (data === trig[2])
                return true
            break
        case "dataHas":
            if (~data.indexOf(trig[2]))
                return true
            break
        case "codeChanged":
            if (String(res.status) != memory && memory[0] !== "unset")
                return true
            break
        case "codeIs":
            if (String(res.status) === trig[1])
                return true
            break
        case "codeHas":
            if (~String(res.status).indexOf(trig[1]))
                return true
            break
        default:
            return false
    }
    return false
}

async function check_response(action, res) {
    let results = []
    let newmem = []
    let data = res.data
    console.log(action.trigger)
    console.log(res.status)
    let mem_index = 0
    await action.trigger.forEach(async (trig, i) => {
        if (trig[0] == "&&" || trig[0] == "||") {
            results[i] = trig[0]
            return
        }
        if (~trig[0].indexOf("data"))
            trig[1].split('.').forEach((elem) => {data = data[elem]})
        else 
            data = res.status
        console.log(data)
        newmem.push(data)
        console.log(newmem)
        let ret = await check_trigger(trig, action.memory[mem_index], res, data)
        results[i] = ret
        mem_index++
    })
    console.log(newmem)
    action.memory = newmem
    await action.save()
    console.log(results)
    for (let i = 0; typeof results[i + 2] !== 'undefined'; i += 2) {
        console.log(results[i])
        if (results[i + 1] == '&&') {
            results[i+2] = results[i] && results[i + 2]
            results[i] = ''
            results[i+1] = ''
        }
    }
    results = results.filter(val => typeof val !== 'string' || val != '')
    for (let i = 0; typeof results[i + 2] !== 'undefined'; i += 2) {
        console.log(results[i])
        if (results[i + 1] == '||') {
            results[i+2] = results[i] || results[i + 2]
            results[i] = ''
            results[i+1] = ''
        }
    }
    results = results.filter(val => typeof val !== 'string' || val != '')
    console.log(results)
    return results[0]
    /*let data = res.data
    if (~action.trigger[0].indexOf("data"))
        action.trigger[1].split('.').forEach((elem) => {data = data[elem]})
    else 
        data = res.status
    let ret = await check_trigger(action, res, data)
    action.memory = data
    action.save()
    return ret*/
}

async function get_headers(reaction, user) {
    const header = {}
    await reaction.populate("service")
    await user.populate("keys")
    let keys = await user.keys.find(e => e.service === reaction.service.name)
    reaction.header.split(',').forEach(element => {
        let type = element.split(':')
        let data = keys.keys.get(type[type.length - 1])
        if (typeof data === 'undefined')
            data = reaction.service.appKeys.get(type[type.length - 1])
        header["Authorization"] = typeof data === 'undefined' ? element : type[0] + " " + data
    })
    console.log(header)
    return header
}

function complete_url(url, params) {
    params.forEach((p) => {
        url = url.replaceAll('{' + p.name + '}', p.value)
    })
    return url
}

Action.methods.check = async function(user, params) {
    try {
        console.log("action")
        console.log(params)
        console.log(complete_url(this.endpointUrl, params))
        return await check_response(this, await axios({
            method: this.method,
            url: complete_url(this.endpointUrl, params),
            headers: await get_headers(this, user),
            data: this.body
        }))
    } catch(e)  {
        console.log(e)
    }
}

module.exports = mongoose.model('Action', Action)