const express = require("express");
const User = require("../../../models/v1/user");
const axios = require("axios");
const UserKeys = require("../../../models/v1/userkeys");
const router = express.Router();

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
