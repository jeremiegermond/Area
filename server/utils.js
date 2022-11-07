const Services = require("./models/v1/services.js");
const Action = require("./models/v1/action.js");
const Reaction = require("./models/v1/reaction.js");
const Webhook = require("./models/v1/webhook.js");
const Api_call = require("./models/v1/api_call.js");
const { db } = require("./models/v1/action.js");

exports.addService = async (body) => {
    const {name, desc, appKeys} = body;
    const map = new Map();
    appKeys.split(",").forEach((elem) => {
        map.set(
        elem.substring(0, elem.indexOf(":")),
        elem.substring(elem.indexOf(":") + 1)
        );
    });
    const newService = new Services({
        name: name,
        description: desc,
        appKeys: map,
    });
    await newService.save()
    console.log("created service "+name)
}

async function addApiAction(body) {
  const interleave = (arr, x) => arr.flatMap((e) => [e, x]).slice(0, -1);
  const {service, name, desc, method, endpointUrl, header, rbody, trigger, userKey, options} = body;
  let trigger_arr = trigger.split(/(&&|\|\|)/);
  trigger_arr.forEach((elem, index) => {
    if (elem !== "&&" || elem !== "||") trigger_arr[index] = elem.split(",");
  });
  const newApi_call = new Api_call({
    method: method,
    endpointUrl: endpointUrl,
    header: header,
    body: rbody,
    trigger: trigger_arr,
    userKey: userKey === "true"
  })
  await newApi_call.save()
  return newApi_call
}

async function addWebhookAction (body) {
  const {target_type, webhook_type, condition_value} = body;
  return await new Webhook({
    target_type: target_type,
    webhook_type: webhook_type,
    condition_value: condition_value
  }).save()
}

exports.addAction = async (body) => {
    const {service, name, desc, method, endpointUrl, header, rbody, trigger, userKey, options} = body;
    const newAction = new Action({
      name: name,
      description: desc,
      options: !options ? null : JSON.parse(options),
      webhook: !method ? await addWebhookAction(body) : null,
      api_call: method ? await addApiAction(body) : null
    });
    await db
      .collection("services")
      .findOneAndUpdate(
        { name: service },
        { $push: { actions: newAction._id } },
        { new: true }
      )
      .then((data) => {
        newAction.service = data.value._id;
      });
    newAction.save().then(() => { return true})
    .catch((error) => {
      console.log(error);
      return false
    });
}

exports.addReaction = async (body) => {
    const {service, name, method, desc, header, rbody, endpointUrl, userKey, options} = body;
    console.log(body)
    const newReaction = new Reaction({
      name: name,
      description: desc,
      method: method,
      endpointUrl: endpointUrl,
      header: header,
      body: rbody,
      userKey: userKey === "true",
      options: !options ? null : JSON.parse(options),
    });
    await db
    .collection("services")
    .findOneAndUpdate(
      { name: service },
      { $push: { reactions: newReaction._id } },
      { new: true }
    )
    .then((data) => {
      newReaction.service = data.value._id;
    });
    newReaction
      .save()
}