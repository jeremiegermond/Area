const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.post("/webhook", (req, res) => {
  const { crc_token } = req.query;
  const crc_response = crypto
    .createHmac("sha256", process.env.TWITTER_APP_SECRET)
    .update(crc_token)
    .digest("base64");
  res.status(200).json({ response_token: `sha256=${crc_response}` });
});

router.post("/create-webhook", async (req, res) => {});

module.exports = router;
