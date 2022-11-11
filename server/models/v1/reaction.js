const mongoose = require("mongoose")
const axios = require("axios")
const Schema = mongoose.Schema

const Reaction = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
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
    type: String,
  },
  body: {
    type: String,
  },
  service: {
    type: Schema.ObjectId,
    ref: "Services",
  },
  userKey: {
    type: Boolean,
  },
  options: {
    type: Array,
  },
})

async function get_headers(action, user, service) {
  const header = {}
  await user.populate("keys")
  let keys = await user.keys.find((e) => e.service === service.name)
  action.header.split(",").forEach((element) => {
    let type = element.split(":")
    let data = keys.keys.get(type[type.length - 1])
    if (typeof data === "undefined")
      data = service.appKeys.get(type[type.length - 1])
    header[type[0]] =
      typeof data === "undefined" ? element : data
  })
  console.log(header)
  return header
}

function complete_string(str, params) {
  if(str && params)
    params.forEach((p) => {
      str = str.replaceAll("{" + p.name + "}", p.value);
    });
  return str;
}

Reaction.methods.exec = async function (user, params) {
  console.log("\n\nreaction\n\n")
  try {
    console.log(`${user.username} : Triggered reaction ${this.name}`)
    await this.populate("service")
    console.log(await axios({
      method: this.method,
      url: complete_string(this.endpointUrl, params),
      headers: await get_headers(this, user, this.service),
      data: complete_string(this.body, params),
    }))
    console.log(this.body)
  } catch (e) {
    console.log(e)
  }
}

module.exports = mongoose.model("Reaction", Reaction)
