const axios = require("axios");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Api_call = new Schema({
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
  trigger: {
    type: Array,
  },
  userKey: {
    type: Boolean,
  },
})

async function check_trigger(trig, memory, res, data) {
  if (typeof data === "undefined") return false;
  switch (trig[0]) {
    case "dataChanged":
      if (data !== memory && memory !== "unset") return true;
      break;
    case "dataIs":
      if (data === trig[2]) return true;
      break;
    case "dataHas":
      if (~data.indexOf(trig[2])) return true;
      break;
    case "codeChanged":
      if (String(res.status) !== memory && memory !== "unset") return true;
      break;
    case "codeIs":
      if (String(res.status) === trig[1]) return true;
      break;
    case "codeHas":
      if (~String(res.status).indexOf(trig[1])) return true;
      break;
    default:
      return false;
  }
  return false;
}

async function check_response(action, res, ar) {
  try {
    let results = [];
    let newmem = [];
    let data = res.data;
    //console.log(action.trigger);
    //console.log(res.data);
    if (data.errors)
      throw new Error("TypeError: Cannot read properties of undefined")
    let mem_index = 0;
    await action.trigger.forEach(async (trig, i) => {
      if (trig[0] === "&&" || trig[0] === "||") {
        results[i] = trig[0];
        return;
      }
      if (~trig[0].indexOf("data"))
        trig[1].split(".").forEach((elem) => {
          data = data[elem];
        });
      else data = res.status;
      newmem.push(data);
      let ret = await check_trigger(trig, ar.memory[mem_index], res, data);
      results[i] = ret;
      mem_index++;
    });
    //console.log(newmem);
    ar.memory = newmem;
    await ar.save();
    for (let i = 0; typeof results[i + 2] !== "undefined"; i += 2) {
      if (results[i + 1] === "&&") {
        results[i + 2] = results[i] && results[i + 2];
        results[i] = "";
        results[i + 1] = "";
      }
    }
    results = results.filter((val) => typeof val !== "string" || val !== "");
    for (let i = 0; typeof results[i + 2] !== "undefined"; i += 2) {
      if (results[i + 1] === "||") {
        results[i + 2] = results[i] || results[i + 2];
        results[i] = "";
        results[i + 1] = "";
      }
    }
    results = results.filter((val) => typeof val !== "string" || val !== "");
    //console.log(results);
    return results[0];
  } catch (err) {
    console.log(err)
    return false
  }
}

async function get_headers(action, user, service) {
  const header = {};
  await user.populate("keys");
  let keys = await user.keys.find((e) => e.service === service.name);
  action.header.split(",").forEach((element) => {
    let type = element.split(":");
    let data = keys.keys.get(type[type.length - 1]);
    if (typeof data === "undefined")
      data = service.appKeys.get(type[type.length - 1]);
    header[type[0]] =
      typeof data === "undefined" ? element : data;
  });
  console.log(header)
  return header;
}

function complete_url(url, params) {
  params.forEach((p) => {
    url = url.replaceAll("{" + p.name + "}", p.value);
  });
  return url;
}

Api_call.methods.check = async function (user, service, ar) {
  try {
    const params = ar.action_params
    console.log("Checking for action " + ar.action.name);
    complete_url(this.endpointUrl, params)
    return await check_response(
      this,
      await axios({
        method: this.method,
        url: complete_url(this.endpointUrl, params),
        headers: await get_headers(this, user, service),
        data: this.body,
      }),
      ar
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = mongoose.model("Api_call", Api_call);