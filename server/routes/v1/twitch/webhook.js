const express = require("express");
const router = express.Router();
const ActionReaction = require("../../../models/v1/actionreaction.js");

router.post("/webhook", async (req, res) => {
  const messageType = req.header("Twitch-Eventsub-Message-Type");
  if (messageType === "webhook_callback_verification") {
    const { challenge } = req.body;
    console.log("callback verification", challenge);
    res.send(challenge);
  } else if (messageType === "notification") {
    console.log("twitch webhook triggered");
    console.log(req.body);
    await ActionReaction.find(
      { webhook_uid: req.body.subscription.id },
      (err, ars) => {
        if (err) console.log(err);
        console.log(ars);
        ars.forEach((ar) => {
          ar.populate("reaction").then(async () => {
            await ar.populate("user");
            console.log(ar.user);
            await ar.reaction.exec(ar.user, ar.reaction_params);
          });
        });
      }
    ).clone();
    res.send("");
  }
});

router.post("/create-webhook", async (req, res) => {
  //.then((r) => {
  //  res.status(200).send(r.data['data']['id']);
  //});
});
module.exports = router;
