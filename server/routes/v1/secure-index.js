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
const api = require("./api");

router.use("/twitter", twitter);
router.use("/twitch", twitch);
router.use("/reddit", reddit);
router.use("/epitech", epitech);
router.use("/", api);

router.get("/profile", async (req, res) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

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
  // needs to be updated with new table
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
    console.log(action);
    const newActionReaction = await new ActionReaction({
      action: action._id,
      reaction: reaction._id,
    });
    split_params(action_params, newActionReaction.action_params);
    split_params(reaction_params, newActionReaction.reaction_params);
    newActionReaction.save().then(() => {
      console.log(newActionReaction);
      user.actionReaction.push(newActionReaction);
      console.log(user);
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
