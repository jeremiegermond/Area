const { Router } = require("express");
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();
const Webhook = require("../../../models/v1/webhook");
const ActionReaction = require("../../../models/v1/actionreaction.js");

router.post("/webhook", async (req, res) => {
    if (req.header("Twitch-Eventsub-Message-Type") === "webhook_callback_verification") {
      console.log(req.body.challenge);
      res.send(req.body.challenge);
    }
    else if (req.header("Twitch-Eventsub-Message-Type") === "notification") {
      console.log("twitch webhook triggered")
      console.log(req.body);
      await ActionReaction.find({webhook_uid: req.body.subscription.id}, (err, ars) => {
        if (err)
          console.log(err);
        console.log(ars);
        ars.forEach(ar => {
          ar.populate("reaction").then(async () => {
            await ar.populate('user')
            console.log(ar.user)
            await ar.reaction.exec(ar.user, ar.reaction_params);
          });
        });
      }).clone();
      res.send("");
    }
  });

router.post("/create-webhook", async (req, res) => {
  //.then((r) => {
  //  res.status(200).send(r.data['data']['id']);
  //});
});
module.exports = router;
