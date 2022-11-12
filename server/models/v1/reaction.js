const mongoose = require("mongoose");
const axios = require("axios");
const utils = require("../../utils");
const Schema = mongoose.Schema;

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
});

Reaction.methods.exec = async function (user, params) {
  console.log("\n\nreaction\n\n");
  try {
    console.log(`${user.username} : Triggered reaction ${this.name}`);
    await this.populate("service");
    console.log(
      await axios({
        method: this.method,
        url: await utils.completeUrl(
          user,
          this.service,
          this.endpointUrl,
          params
        ),
        headers: await utils.getHeaders(this, user, this.service),
        data: utils.fillParams(this.body, params),
      })
    );
    console.log(this.body);
  } catch (e) {
    console.log(e);
  }
};

module.exports = mongoose.model("Reaction", Reaction);
