const axios = require("axios");
const express = require("express");
const router = express.Router();
const User = require("../../models/v1/user.js");
const ActionReaction = require("../../models/v1/actionreaction.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");

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
    if (action.webhook) {
      await action.populate("webhook service");
      newAR.webhook_uid = await axios.post(
        `${process.env.BASE_URL}:8080/${action.service.name}/link-webhook`,
        {
          webhook: action.webhook,
          params: newAR.action_params,
        }
      );
      console.log(newAR.webhook_uid);
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
    console.log("error adding ActionReaction", error?.response?.data);
    res.status(400).json({
      error: error?.response?.data,
    });
  }
});

module.exports = router;
