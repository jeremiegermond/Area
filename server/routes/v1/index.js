const express = require("express");
const Services = require("../../models/v1/services.js");
const crypto = require("crypto");

const router = express.Router();
const auth = require("./auth");
const service = require("./service");
const area = require("./area/server");
const twitch = require("./twitch/webhook");
const twitter = require("./twitter/webhook");

router.use("/", auth);
router.use("/", service);
router.use("/", area);
router.use("/twitch", twitch);
router.use("/twitter", twitter);

router.get("/", (req, res) => {
  res.status(200).send("It works");
});

router.get("/ping2", async (req, res) => {
  return res.status(200).json(true);
});

router.get("/about.json", async (req, res) => {
  try {
    const ip = req.ip.split(":")[3];
    const services = await Services.find()
      .populate([
        { path: "actions", select: "name description -_id" },
        { path: "reactions", select: "name description -_id" },
      ])
      .select("name action reaction -_id");
    return res.status(200).json({
      client: {
        host: ip,
      },
      server: {
        current_time: Date.now(),
        services: services,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json(error);
  }
});

router.post("/webhooks/twitter", (req, res) => {
  const { crc_token } = req.query;
  const crc_response = crypto
    .createHmac("sha256", process.env.TWITTER_APP_SECRET)
    .update(crc_token)
    .digest("base64");
  res.status(200).json({ response_token: `sha256=${crc_response}` });
});

module.exports = router;
