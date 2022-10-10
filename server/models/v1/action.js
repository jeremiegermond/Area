
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
    expectedResponse: { //suppr
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
    //console.log(action.memory[0])
    let ret = false
    console.log("data="+data)
    if (typeof data === 'undefined')
        return false
    if (action.trigger[0] == "dataChanged")
        if (data != action.memory)
            ret = true
    action.memory = data
    action.save()
    console.log("return")
    return ret
}

async function post(action, args) {
    let ret
    await axios.post(action.endpointUrl, args)
    .then(async (res) => {
        //console.log(`response: ${res.status} expected: ${action.expectedResponse}`);
        ret = await check_response(action, res)
    })
    return (ret)
}

async function get(action, args) {
    let ret
    await axios.get(action.endpointUrl, args)
    .then(async (res) => {
        //console.log(`response: ${res.status} expected: ${action.expectedResponse}`);
        ret = await check_response(action, res)
    })
    return(ret)
}

Action.methods.check = async function(args) {
    try {
        const header = {headers: {}, body: this.body}
        await this.populate("service")
        let ret = false
        this.header.split(',').forEach(element => {
            header.headers[element] = this.service.appKeys.get(element)
        });
        //console.log(header)
        if (this.method == "post")
            ret = await post(this, header)
        else if (this.method == "get")
            ret = await get(this, header)
        else
            console.log(`Unknown method ${this.method}`)
        //console.log(ret)
        return ret
    } catch(e)  {
        //console.log(e)
    }
}

module.exports = mongoose.model('Action', Action)