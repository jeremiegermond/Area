const mongoose = require("mongoose");
const axios = require("axios");
const Schema = mongoose.Schema;

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
});

async function get_headers(reaction, user) {
  const header = {};
  await reaction.populate("service");
  await user.populate("keys");
  let keys = await user.keys.find((e) => e.service === reaction.service.name);
  reaction.header.split(",").forEach((element) => {
    let type = element.split(":");
    let data = keys.keys.get(type[type.length - 1]);
    if (typeof data === "undefined")
      data = reaction.service.appKeys.get(type[type.length - 1]);
    header["Authorization"] =
      typeof data === "undefined" ? element : type[0] + " " + data;
  });
  console.log(header);
  return header;
}

function complete_url(url, params) {
  params.forEach((p) => {
    url = url.replaceAll("{" + p.name + "}", p.value);
  });
  return url;
}

Reaction.methods.exec = async function (user, params) {
  console.log("\n\nreaction\n\n");
  try {
    console.log(
      `${user.username} : Triggered reaction ${this.name}, ${this.description}`
    );
    await axios({
      method: this.method,
      url: complete_url(this.endpointUrl, params),
      headers: await get_headers(this, user),
      data: this.body,
    }).then((res) => {
      console.log(res);
      console.log(res.data);
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = mongoose.model("Reaction", Reaction);
