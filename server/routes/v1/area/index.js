const express = require("express");
const Action = require("../../../models/v1/action");
const User = require("../../../models/v1/user");
const Reaction = require("../../../models/v1/reaction");
const router = express.Router();

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
    res.status(200).json(actionReaction);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting ar");
  }
});

router.delete("/deleteActionReaction/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.findOne({ username: req.user.username }).then(async (user) => {
      user.actionReaction = user.actionReaction.filter(
        ({ _id }) => !_id.equals(id)
      );
      await user.save().then(() => res.status(200).send("ar deleted"));
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
