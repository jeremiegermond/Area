
const mongoose = require('mongoose')
const axios =  require('axios')
const Schema = mongoose.Schema

const Reaction = new Schema({
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
    }
})

Reaction.methods.exec = async function(args) {
    console.log("\n\nreaction\n\n")
    /*axios({
        method: 'post',
        url: 'https://oauth.reddit.com/api/submit?sr=test&text=A tweet was posted&title=le titre&kind=self',
        headers: {"Authorization" : 'Bearer 1134249758389-cuHXyTP4jpJji6K369Xg_qe61mceRA'},
        data: {
            "resubmit" : "true",
            "send_replies" : "true",
            "api_type" : "json"
        }
    })
    .then(res => {
        console.log(res);
        console.log(res.data);
    })*/
}

module.exports = mongoose.model('Reaction', Reaction)