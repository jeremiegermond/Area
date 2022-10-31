const express = require("express");
const router = express.Router();
const User = require("../../models/v1/user.js");
const ActionReaction = require("../../models/v1/actionreaction.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");
const UserKeys = require("../../models/v1/userkeys.js");
const OAuth = require("oauth");
const crypto = require("crypto");
const axios = require("axios");

router.get("/profile", (req, res) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

router.get("/hasApi/:api", async (req, res) => {
  const { api } = req.params;
  await User.findOne({ username: req.user.username })
    .populate("keys")
    .then((user) => {
      res.status(200).json(!!user.keys.find(({ service }) => service === api));
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

router.get("/getActionReaction", async (req, res) => {  // needs to be updated with new table
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

router.delete("/deleteActionReaction/:id", async (req, res) => {  // needs to be updated with new table
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

router.post("/addActionReaction", async (req, res) => {
  try {
    const split_params = (params, dest) => {
      params.split(',').forEach((p) => { 
        if (p === "")
          return
        p = p.split(':')
        dest.push({name: p[0], value: p[1]})
      })
    }
    const { action_id, reaction_id, action_params, reaction_params } = req.body;
    let usr = await User.findOne({ name: req.user.username });
    let act = await Action.findById(action_id);
    let react = await Reaction.findById(reaction_id);
    console.log(act)
    const ar = new ActionReaction({
      action: act._id,
      reaction: react._id,
    })
    split_params(action_params, ar.action_params)
    split_params(reaction_params, ar.reaction_params)
    ar.save().then(() => {
      console.log(ar);
      usr.actionReaction.push(ar);
      console.log(usr);
      usr.save().then(() => {
        res.status(201).json({
          message: `action ${act.name} and reaction ${react.name} successfully added to user ${req.user.username}`,
        });
      })
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
  process.env.TWITTER_APP_ID,
  process.env.TWITTER_APP_SECRET,
  "1.0A",
  `${process.env.BASE_URL}:8081/connect-api/twitter`,
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
            .set("secret", oauthAccessTokenSecret.toString());
          new UserKeys({
            service: "twitter",
            keys: map,
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
    oauthRequestTokenSecret
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
  const { code } = req.body;
  try {
    await User.findOne({ username: req.user.username }).then(async (user) => {
      await axios({
        method: "post",
        url: "https://www.reddit.com/api/v1/access_token",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.REDDIT_APP_ID}:${process.env.REDDIT_APP_SECRET}`
          ).toString("base64")}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        data: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: `${process.env.BASE_URL}:8081/connect-api/reddit`,
        },
      }).then((r) => {
        const map = new Map()
          .set("access_token", r.data["access_token"].toString())
          .set("refresh_token", r.data["refresh_token"].toString());
        new UserKeys({
          service: "reddit",
          keys: map,
        })
          .save()
          .then((key) => {
            console.log(user);
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
  let url = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_APP_ID}&response_type=code&state=${random_string}&redirect_uri=${process.env.BASE_URL}:8081/connect-api/reddit&duration=permanent&scope=read,submit,account`;
  res.status(200).json({ path: url });
});

router.post("/twitch/callback", async (req, res) => {
  const { code } = req.body;
  let url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_APP_ID}&client_secret=${process.env.TWITCH_APP_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.BASE_URL}:8081/connect-api/twitch`;
  try {
    await User.findOne({ username: req.user.username }).then(async (user) => {
      console.log(user);
      await axios({
        method: "post",
        url: url,
      }).then((r) => {
        const map = new Map()
          .set("access_token", r.data["access_token"].toString())
          .set("refresh_token", r.data["refresh_token"].toString());
        new UserKeys({
          service: "twitch",
          keys: map,
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
  const uri = new URL("https://id.twitch.tv/oauth2/authorize");
  uri.searchParams.append(
    "redirect_uri",
    process.env.BASE_URL + ":8081/connect-api/twitch"
  );
  uri.searchParams.append("client_id", process.env.TWITCH_APP_ID);
  uri.searchParams.append("response_type", "code");
  uri.searchParams.append(
    "scope",
    "user:edit user:read:follows channel:manage:broadcast"
  );
  res.status(200).json({ path: uri.href });
});

module.exports = router;
