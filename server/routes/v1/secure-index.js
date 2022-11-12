const axios = require("axios");
const express = require("express");
const router = express.Router();
const User = require("../../models/v1/user.js");
const ActionReaction = require("../../models/v1/actionreaction.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");
const crypto = require("crypto");

const twitter = require("./twitter");
const twitch = require("./twitch");
const reddit = require("./reddit");
const epitech = require("./epitech");
const spotify = require("./spotify");
const area = require("./area");
const api = require("./api");

router.use("/twitter", twitter);
router.use("/twitch", twitch.router);
router.use("/reddit", reddit);
router.use("/spotify", spotify);
router.use("/epitech", epitech);
router.use("/", area);
router.use("/", api);

router.get("/profile", async (req, res) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

function get_twitch_bearer() {
  const uri = twitch.twitchUrl();
  uri.searchParams.append("grant_type", "client_credentials");
  try {
    console.log("Get bearer");
    return axios({
      method: "post",
      url: uri,
    }).then((r) => {
      return r.data["access_token"];
    });
  } catch (e) {
    console.log("error getting bearer", e.response.data);
    throw Error("Bearer failed");
  }
}

function complete_param(url, params) {
  params.forEach((p) => {
    url = url.replaceAll("{" + p.name + "}", p.value);
  });
  return url;
}

async function linkWebhook(webhook, params) {
  console.log("\n\n\n");
  console.log(webhook);
  const webhook_header = {
    Authorization: `Bearer ${await get_twitch_bearer()}`,
    "Client-ID": process.env.TWITCH_APP_ID,
  };
  const target_type = complete_param(webhook.target_type, params);
  const webhook_type = complete_param(webhook.webhook_type, params);
  const condition_value = complete_param(webhook.condition_value, params);

  const { data } = await axios({
    method: "get",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: webhook_header,
  });
  const id =
    data.data.forEach((webhook) => {
      console.log(webhook);
      if (
        webhook["status"] === "enabled" &&
        webhook["type"] === webhook_type &&
        webhook["condition"][target_type] === condition_value
      )
        return webhook["id"];
    }) ?? "";
  console.log("id", id);

  // const id = await check_current_subscription(
  //   target_type,
  //   webhook_type,
  //   condition_value
  // );
  console.log(condition_value);
  if (id !== "") {
    console.log("Webhook already exists");
    return id;
  }
  const newWebhookData = {
    type: webhook.webhook_type,
    version: "1",
    condition: { target_type: condition_value },
    transport: {
      method: "webhook",
      callback: `${process.env.WEBHOOK_URL}/twitch/webhook`,
      secret: crypto.randomBytes(10).toString("hex"),
    },
  };
  try {
    console.log("post subscription");

    axios({
      method: "post",
      url: "https://api.twitch.tv/helix/eventsub/subscriptions",
      headers: webhook_header,
      data: newWebhookData,
    }).then(async (r) => {
      return r.data["data"]["id"];
    });
  } catch (e) {
    console.log("Axios fail", e.response.data);
  }
}

router.post("/addActionReaction", async (req, res) => {
  try {
    const split_params = (params, dest) => {
      params.split(",").forEach((p) => {
        if (p === "") return;
        p = p.split(":");
        dest.push({ name: p[0], value: p[1] });
      });
    };
    const { action_id, reaction_id, action_params, reaction_params } = req.body;
    const user = await User.findOne({ name: req.user.username });
    const action = await Action.findById(action_id);
    const reaction = await Reaction.findById(reaction_id);
    const newAR = await new ActionReaction({
      action: action._id,
      reaction: reaction._id,
      memory: ["unset"],
      webhook_uid: "",
      user: user,
    });
    split_params(action_params, newAR.action_params);
    split_params(reaction_params, newAR.reaction_params);
    console.log(action.webhook);
    if (action.webhook) {
      await action.populate("webhook");
      newAR.webhook_uid = await linkWebhook(
        action.webhook,
        newAR.action_params
      );
    }
    newAR.save().then(() => {
      user.actionReaction.push(newAR);
      user.save().then(() => {
        res.status(201).json({
          message: `action ${action.name} and reaction ${reaction.name} successfully added to user ${req.user.username}`,
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
});

module.exports = router;
