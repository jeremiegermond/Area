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

router.get("/getActions", async (req, res) => {
  let data = [];
  const actions = await Action.find({})
    .populate({ path: "service", select: "name" })
    .select(["name", "description", "service"]);

  await User.findOne({ username: req.user.username })
    .populate("keys")
    .then((user) => {
      user.keys.forEach((key) => {
        data.push(actions.filter(({ service }) => service.name === key.service));
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
    const { action_id, reaction_id } = req.body;
    let act = await Action.findById(action_id);
    let react = await Reaction.findById(reaction_id);
    let usr = await User.findOne({ name: req.user.username });
    console.log(usr);
    usr.actionReaction.push({
      action: act._id,
      reaction: react._id,
    });
    usr.save().then(() => {
      res.status(201).json({
        message: `action ${act.name} and reaction ${react.name} successfully added to user ${req.user.username}`,
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
          const map = new Map()
          .set("public", oauthAccessToken.toString())
          .set("secret", oauthAccessTokenSecret.toString())
          const newUserKeys = new UserKeys({
            service: "twitter",
            keys: map
          })
            .save()
            .then((data) => {
              usr.keys.push(data);
              usr.save().then(() => {
                console.log(`Twitter key added to ${usr.username}`);
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
  const { code } = req.body;
  try {
    await User.findOne({ username: req.user.username }).then(async (user) => {
      await axios({
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
          code: code,
          redirect_uri: "http://localhost:8081/connect-api/reddit",
        },
      })
        .then((r) => {
        const map = new Map()
        .set("access_token", r.data["access_token"].toString())
        .set("refresh_token", r.data["refresh_token"].toString())
        new UserKeys({
          service: "reddit",
          keys: map
        })
          .save()
          .then((key) => {
            console.log(user)
            user.keys.push(key);
            user.save().then(() => {
              console.log(`Reddit key added to ${user.username}`);
              res.status(201).json({
                message: `response`,
              });
            });
          });
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/reddit/addAccount", async (req, res) => {
  let random_string = crypto.randomBytes(5).toString("hex");
  let url = `https://www.reddit.com/api/v1/authorize?client_id=isUVYO3_2jTORpYN_SVSZA&response_type=code&state=${random_string}&redirect_uri=http://localhost:8081/connect-api/reddit&duration=permanent&scope=read,submit,account`;
  res.status(200).json({ path: url });
});


router.post("/twitch/callback", async (req, res) => {
  const CLIENT_ID = "vi9za74j91x41dxvhmdsyjzau002xe";
  const CLIENT_SECRET = "5f9xt5qhr8ly2n84q4qwxb7ocac38z"
  const { code } = req.body;
  let url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:8081/connect-api/twitch`
  try {
    await User.findOne({ username: req.user.username }).then(async (user) => {
      console.log(user)
      await axios({
        method: "post",
        url: url
      }).then((r) => {
        const map = new Map()
        .set("access_token", r.data["access_token"].toString())
        .set("refresh_token", r.data["refresh_token"].toString())
        new UserKeys({
          service: "twitch",
          keys: map
        })
          .save()
          .then((key) => {
            user.keys.push(key);
            user.save().then(() => {
              console.log(`Twitch key added to ${user.username}`);
              res.status(201).json({
                message: `response`,
              });
            });
          });
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/twitch/addAccount", async (req, res) => {
  let client_id = "vi9za74j91x41dxvhmdsyjzau002xe"
  url = `https://id.twitch.tv/oauth2/authorize?redirect_uri=http://localhost:8081/connect-api/twitch&client_id=${client_id}&response_type=code&scope=user%3Aedit+user%3Aread%3Afollows+channel%3Amanage%3Abroadcast`
  res.status(200).json({ "path": url })
});


module.exports = router;
