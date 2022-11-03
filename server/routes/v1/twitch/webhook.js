const { Router } = require("express");
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();

router.post("/webhook", (req, res) => {
    if (
      req.header("Twitch-Eventsub-Message-Type") ===
      "webhook_callback_verification"
    ) {
      console.log(req.body.challenge);
      res.send(req.body.challenge);
    } else if (req.header("Twitch-Eventsub-Message-Type") === "notification") {
      console.log(req.body);
      res.send("");
    }
  });
  
function get_twitch_bearer() {
     return axios({
      method: "post",
      url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_APP_ID}&client_secret=${process.env.TWITCH_APP_SECRET}&grant_type=client_credentials`,
    }).then((r) => {
      console.log(r.data["access_token"])
      return r.data["access_token"];
    });
  }

async function check_current_subscription(target_type, webhook_type, condition_value) {
  const temp_bearer = await get_twitch_bearer();
  let id = ''
  const {data} = await axios({
    method: "get",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: { 'Authorization': `Bearer ${temp_bearer}`,
          "Client-ID": "vi9za74j91x41dxvhmdsyjzau002xe" },
  })
  data.data.forEach(function(webhook) {
    if(webhook['status'] == 'enabled' && webhook['type'] == webhook_type && webhook['condition'][target_type] == condition_value)
      id = webhook['id']
  });
  return id
}

router.post("/create-webhook", async (req, res) => {
  const {target_type, webhook_type, condition_value} = req.body;
  let id = await check_current_subscription(target_type, webhook_type, condition_value);
  if (id != '')
    console.log(`Id already exist : ${id}`)
  res.send("")
  /*
    const temp_bearer = await get_twitch_bearer();
    const body = {
      type: req.body["webhook_type"],
      version: "1",
      condition: {},
      transport: {
        method: "webhook",
        callback: "https://2843-163-5-2-51.eu.ngrok.io/twitch/webhook",
        secret: crypto.randomBytes(10).toString("hex"),
      },
    };
    body["condition"][target_type] = req.body["condition_value"];
    await axios({
      method: "post",
      url: "https://api.twitch.tv/helix/eventsub/subscriptions",
      headers: {
        Authorization: `Bearer ${temp_bearer}`,
        "Client-ID": "vi9za74j91x41dxvhmdsyjzau002xe",
      },
      data: body,
    }).then((r) => {
      res.status(200).send(r.data['data']['id']);
    });
    */
  });
module.exports = router;
