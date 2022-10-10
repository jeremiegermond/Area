const express = require("express");
const router = express.Router();
const mongodb = require("../../db/mongo");
const User = require("../../models/v1/user.js");
const Services = require("../../models/v1/services.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");
const UserKeys = require("../../models/v1/userkeys.js");
const OAuth = require("oauth");
const crypto = require("crypto");
const axios = require("axios");

router.get("/profile", (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

router.get("/hasApi/:api", async (req, res) => {
  const { api } = req.params;
  await User.findOne({ username: req.user.username }).then((user) => {
    user.populate("keys").then(() => {
      res.status(200).json(!!user.keys.find(({ service }) => service === api));
    });
  });
});

router.delete("/deleteApi/:api", async (req, res) => {
  try {
    const { api } = req.params;
    await User.findOne({ username: req.user.username })
      .populate("keys")
      .then(async (user) => {
        console.log(user.keys.filter(({ service }) => service !== api));
        user.keys
          .filter(({ service }) => service === api)
          .forEach((key) => UserKeys.deleteOne({ _id: key.id }).then());
        user.keys = user.keys.filter(({ service }) => service !== api);
        await user.save().then(() => res.status(200).send("Api deleted"));
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: e,
    });
  }
});

router.post("/addActionReaction", async (req, res, next) => {
  try {
    const { service, action_id, reaction_id } = req.body;
    let act = await Action.findById(action_id);
    let react = await Reaction.findById(reaction_id);
    let usr = await User.findOne({ name: req.user.name });
    console.log(usr);
    usr.actionReaction.push({
      action: act._id,
      reaction: react._id,
    });
    usr.save().then(() => {
      res.status(201).json({
        message: `action ${act.name} and reaction ${react.name} successfully added to user ${req.user.name}`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
});

const consumer = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "8uDiSmBXliIrxodHw6mwuaJyh",
  "NOtO3KLwKFeXm6YuH4wiM5qtzUAi87sUiYD6piZc5jjOP4Ip4k",
  "1.0A",
  "http://localhost:8081/connect-api/twitter",
  "HMAC-SHA1"
);

router.post("/twitter/callback", function (req, res) {
  try {
    consumer.getOAuthAccessToken(
      req.body["oauth_token"],
      null,
      req.body["oauth_verifier"],
      async (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error) {
          console.log(error);
          res.status(500).send(error + " " + results);
        } else {
          let usr = await User.findOne({ username: req.user.username });
          console.log(usr.keys);
          console.log(oauthAccessToken + " " + oauthAccessTokenSecret);
          const newUserKeys = new UserKeys({
            service: "twitter",
            public_key: oauthAccessToken.toString(),
            private_key: oauthAccessTokenSecret.toString(),
          })
            .save()
            .then((data) => {
              usr.keys.push(data);
              usr.save().then(() => {
                res.status(201).json({
                  message: `response`,
                });
              });
            });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.get("/twitter/addAccount", function (req, res) {
  consumer.getOAuthRequestToken(function (
    error,
    oauthRequestToken,
    oauthRequestTokenSecret,
    results
  ) {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send({ error: "Error getting OAuth request token : " + error });
    } else {
      res.status(200).send({
        path:
          "https://twitter.com/oauth/authorize?oauth_token=" +
          oauthRequestToken +
          "&oauth_token_secret=" +
          oauthRequestTokenSecret,
      });
    }
  });
});

router.post("/reddit/callback", async (req, res) => {
  const CLIENT_ID = "isUVYO3_2jTORpYN_SVSZA";
  const CLIENT_SECRET = "3X7O0lsVJ5HjWE3YC2QB7OBKZxOXtQ";
  console.log(req.body["code"]);
  const data = await axios({
    method: "post",
    url: "https://www.reddit.com/api/v1/access_token",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "authorization_code",
      code: req.body["code"],
      redirect_uri: "http://localhost:8081/connect-api/reddit",
    },
  });
  let usr = await User.findOne({ username: req.user.username });
  new UserKeys({
    service: "reddit",
    public_key: data.data["access_token"].toString(),
    private_key: data.data["refresh_token"].toString(),
  })
    .save()
    .then((data) => {
      usr.keys.push(data);
      usr.save().then(() => {
        res.status(201).json({
          message: `response`,
        });
      });
    });
  console.log(data.data);
});

router.get("/reddit/create", async (req, res) => {
  let random_string = crypto.randomBytes(5).toString("hex");
  let url = `https://www.reddit.com/api/v1/authorize?client_id=isUVYO3_2jTORpYN_SVSZA&response_type=code&state=${random_string}&redirect_uri=http://localhost:8081/connect-api/reddit&duration=permanent&scope=read,submit,account`;
  res.status(200).json({ path: url });
});

module.exports = router;
