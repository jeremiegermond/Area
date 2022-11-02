const express = require("express");
const router = express.Router();
const User = require("../../models/v1/user.js");
const ActionReaction = require("../../models/v1/actionreaction.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");

const twitter = require("./twitter");
const twitch = require("./twitch");
const reddit = require("./reddit");
const api = require("./api");

router.use("/twitter", twitter);
router.use("/twitch", twitch);
router.use("/reddit", reddit);
router.use("/", api);

router.get("/profile", (req, res) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

router.get("/getActions", async (req, res) => {
  let data = [];
  const actions = await Action.find({})
    .populate({ path: "service", select: "name" })
    .select(["name", "description", "service"]);

  await User.findOne({ username: req.user.username })
    .populate("keys")
    .then((user) => {
      user.keys.forEach((key) => {
        data.push(
          actions.filter(({ service }) => service.name === key.service)
        );
        console.log(data);
      });
      res.status(200).json(data.flat());
    });
});

router.get("/getReactions", async (req, res) => {
  let data = [];
  const reactions = await Reaction.find({})
    .populate({ path: "service", select: "name" })
    .select(["name", "description", "service"]);
  await User.findOne({ username: req.user.username })
    .populate("keys")
    .then((user) => {
      user.keys.forEach((key) => {
        data.push(
          reactions.filter(({ service }) => service.name === key.service)
        );
      });
      res.status(200).json(data.flat());
    });
});

router.get("/getActionReaction", async (req, res) => {
  // needs to be updated with new table
  try {
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
    let usr = await User.findOne({ name: req.user.username });
    let act = await Action.findById(action_id);
    let react = await Reaction.findById(reaction_id);
    console.log(act);
    const ar = new ActionReaction({
      action: act._id,
      reaction: react._id,
    });
    split_params(action_params, ar.action_params);
    split_params(reaction_params, ar.reaction_params);
    ar.save().then(() => {
      console.log(ar);
      usr.actionReaction.push(ar);
      console.log(usr);
      usr.save().then(() => {
        res.status(201).json({
          message: `action ${act.name} and reaction ${react.name} successfully added to user ${req.user.username}`,
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
