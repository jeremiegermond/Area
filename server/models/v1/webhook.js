const axios = require("axios");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Webhook = new Schema({
    target_type : {
        type: String
    },
    webhook_type : {
        type: String
    },
    condition_value : {
        type: String
    },
})

Webhook.methods.check = async function (user, params, memory) {
    try {

    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoose.model("Webhook", Webhook);