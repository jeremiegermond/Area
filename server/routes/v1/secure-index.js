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
const api = require("./api");

router.use("/twitter", twitter);
router.use("/twitch", twitch);
router.use("/reddit", reddit);
router.use("/epitech", epitech);
router.use("/", api);

router.get("/getActions", async (req, res) => {
  let data = [];
  try {
    const actions = await Action.find({})
      .populate({
        path: "service",
        select: "name",
      })
      .select("name description service options");
    const { keys } = await User.findOne({
      username: req.user.username,
    }).populate("keys");
    keys.forEach((key) => {
      data.push(actions.filter(({ service }) => service.name === key.service));
    });
    res.status(200).json(data.flat());
  } catch (e) {
    console.log(e);
    res.status(500).send("Couldn't getActions");
  }
});

router.get("/getReactions", async (req, res) => {
  let data = [];
  try {
    const reactions = await Reaction.find({})
      .populate({ path: "service", select: "name" })
      .select("name description service options");
    const { keys } = await User.findOne({
      username: req.user.username,
    }).populate("keys");
    keys.forEach((key) => {
      data.push(
        reactions.filter(({ service }) => service.name === key.service)
      );
    });
    res.status(200).json(data.flat());
  } catch (e) {
    console.log(e);
    res.status(500).send("Couldn't getReactions");
  }
});

router.get("/getActionReaction", async (req, res) => {
  try {
    const { actionReaction } = await User.findOne({
      username: req.user.username,
    }).populate({
      path: "actionReaction",
      populate: [
        { path: "action", select: "name" },
        { path: "reaction", select: "name" },
      ],
    });
    console.log(actionReaction);
    await User.findOne({ username: req.user.username })
      .populate({
        path: "actionReaction",
        populate: [
          { path: "action", select: "name" },
          { path: "reaction", select: "name" },
        ],
      })
      .then((user) => {
        res.status(200).json(user.actionReaction);
      });
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting ar");
  }
});

router.delete("/deleteActionReaction/:id", async (req, res) => {
  // needs to be updated with new table
  const { id } = req.params;
  try {
    await User.findOne({ username: req.user.username })
      // .populate("actionReaction")
      .then(async (user) => {
        user.actionReaction = user.actionReaction.filter(
          ({ _id }) => !_id.equals(id)
        );
        console.log(user.actionReaction);
        console.log(id);
        await user.save().then(() => res.status(200).send("ar deleted"));
      });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

function get_twitch_bearer() {
     return axios({
      method: "post",
      url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_APP_ID}&client_secret=${process.env.TWITCH_APP_SECRET}&grant_type=client_credentials`,
    }).then((r) => {
      console.log(r.data["access_token"])
      return r.data["access_token"];
    });
  }

async function check_current_subscription(target_type, webhook_type, condition_value) {
  const temp_bearer = await get_twitch_bearer();
  let id = ''
  const {data} = await axios({
    method: "get",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: { 'Authorization': `Bearer ${temp_bearer}`,
          "Client-ID": "vi9za74j91x41dxvhmdsyjzau002xe" },
  })
  data.data.forEach(function(webhook) {
    console.log(webhook)
    if(webhook['status'] == 'enabled' && webhook['type'] == webhook_type && webhook['condition'][target_type] == condition_value)
      id = webhook['id']
  });
  return id
}

function complete_param(url, params) {
  params.forEach((p) => {
    url = url.replaceAll("{" + p.name + "}", p.value);
  });
  return url;
}

async function linkWebhook(webhook, params) {
  console.log("\n\n\n")
  console.log(webhook)
  const target_type = complete_param(webhook.target_type, params)
  const webhook_type = complete_param(webhook.webhook_type, params)
  const condition_value = complete_param(webhook.condition_value, params)
  let id = await check_current_subscription(target_type, webhook_type, condition_value);
  console.log(condition_value)
  if (id != '') {
    console.log("Webhook already exists")
    return id
  }
  const data = {
    type: webhook.webhook_type,
    version: "1",
    condition: {},
    transport: {
    method: "webhook",
    callback: `${process.env.WEBHOOK_URL}/twitch/webhook`,
    secret: crypto.randomBytes(10).toString("hex"),
    },
  };
  data["condition"][target_type] = condition_value;
  axios({
      method: "post",
      url: "https://api.twitch.tv/helix/eventsub/subscriptions",
      headers: {
      Authorization: `Bearer ${await get_twitch_bearer()}`,
      "Client-ID": process.env.TWITCH_APP_ID,
      },
      data: data
  }).then(async (r) => {
    return r.data['data']['id']
  })
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
    const newAR = new ActionReaction({
      action: action._id,
      reaction: reaction._id,
      memory: ["unset"],
      webhook_uid: '',
      user: user
    });
    split_params(action_params, newAR.action_params);
    split_params(reaction_params, newAR.reaction_params);
    console.log(action.webhook)
    if (action.webhook) {
      await action.populate('webhook')
      newAR.webhook_uid = await linkWebhook(action.webhook, newAR.action_params)
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
