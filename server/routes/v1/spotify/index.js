const express = require("express");
const User = require("../../../models/v1/user");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();
const querystring = require('querystring')

router.post("/callback", async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({ username: req.user.username });
    await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_APP_ID}:${process.env.SPOTIFY_APP_SECRET}`
        ).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      data: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${process.env.BASE_URL}:8081/connect-api/spotify`,
      },
    }).then((r) => {
      console.log(r.data["access_token"].toString())
      const map = new Map([
        ["access_token", "Bearer " + r.data["access_token"].toString()],
        ["refresh_token", "Bearer " + r.data["refresh_token"].toString()],
      ]);
      user.addApiKey(map, "reddit").then((e) => res.status(201).send(e));
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/addAccount", async (req, res) => {
    const state = crypto.randomBytes(8).toString("hex");

    const uri = new URL("https://accounts.spotify.com/authorize?");
    uri.searchParams.append("client_id", process.env.SPOTIFY_APP_ID);
    uri.searchParams.append("redirect_uri", `${process.env.BASE_URL}:8081/connect-api/spotify`);
    uri.searchParams.append("response_type", "code");
    uri.searchParams.append(
        "scope",
        "playlist-read-private playlist-read-collaborative user-read-private"
      );
      uri.searchParams.append("state", state);
      res.status(200).json({ path: uri.href });
      
});

module.exports = router;