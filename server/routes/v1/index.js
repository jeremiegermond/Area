const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Services = require("../../models/v1/services.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");
const { db } = require("../../models/v1/action.js");
const User = require("../../models/v1/user");
const crypto = require("crypto");
const axios = require("axios");

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    const user = req.user;
    const token = jwt.sign(
      { user: { _id: user._id, username: user.username } },
      "TOP_SECRET"
    );
    res.json({
      message: "Signup successful",
      token: token,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, "TOP_SECRET");
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/addService", (req, res, next) => {
  const { name, desc, appKeys } = req.body;
  const map = new Map();
  appKeys.split(",").forEach((elem) => {
    map.set(
      elem.substring(0, elem.indexOf(":")),
      elem.substring(elem.indexOf(":") + 1)
    );
  });
  const newService = new Services({
    name: name,
    description: desc,
    appKeys: map,
  });
  newService
    .save()
    .then(() => {
      res.status(201).json({
        message: "Service saved successfully!",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
});

router.post("/addAction", async (req, res, next) => {
  try {
    const interleave = (arr, x) => arr.flatMap((e) => [e, x]).slice(0, -1);
    const {
      service,
      name,
      desc,
      method,
      endpointUrl,
      header,
      body,
      trigger,
      userKey,
      options,
    } = req.body;
    console.log(userKey);
    let trigger_arr = trigger.split(/(&&|\|\|)/);
    trigger_arr.forEach((elem, index) => {
      if (elem !== "&&" || elem !== "||") trigger_arr[index] = elem.split(",");
    });
    console.log(trigger_arr);
    const newAction = new Action({
      name: name,
      description: desc,
      method: method,
      endpointUrl: endpointUrl,
      header: header,
      body: body,
      trigger: trigger_arr,
      memory: ["unset"],
      userKey: userKey === "true",
      options: JSON.parse(options),
    });
    await db
      .collection("services")
      .findOneAndUpdate(
        { name: service },
        { $push: { actions: newAction._id } },
        { new: true }
      )
      .then((data) => {
        newAction.service = data.value._id;
      });
    newAction
      .save()
      .then(() => {
        res.status(201).json({
          message: `Action added successfully to service ${service}!`,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error: error });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

router.post("/addReaction", async (req, res, next) => {
  try {
    const {
      service,
      name,
      method,
      desc,
      header,
      body,
      endpointUrl,
      userKey,
      options,
    } = req.body;
    const newReaction = new Reaction({
      name: name,
      description: desc,
      method: method,
      endpointUrl: endpointUrl,
      header: header,
      body: body,
      userKey: userKey === "true",
      options: JSON.parse(options),
    });
    await db
      .collection("services")
      .findOneAndUpdate(
        { name: service },
        { $push: { reactions: newReaction._id } },
        { new: true }
      )
      .then((data) => {
        newReaction.service = data.value._id;
      });
    newReaction
      .save()
      .then(() => {
        res.status(201).json({
          message: `Reaction added successfully to service ${service}!`,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error: error });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
});

router.get("/ping", async (req, res, next) => {
  try {
    let result = await db.collection("services").findOne({ name: "test" });
    console.log(result);
    let ping = await db
      .collection("actions")
      .findOne({ _id: result.actions[0] });
    console.log(ping);
    res.status(201).json({
      message: `Ping "test".actions !`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
});

router.get("/ping2", async (req, res, next) => {
  return res.status(200).json(true);
});

router.get("/exist/:name", async (req, res) => {
  const { name } = req.params;
  try {
    console.log(name);
    const user = await User.findOne({ username: name });
    if (user) {
      return res.status(200).json(true);
    }
    return res.status(201).json(false);
  } catch (error) {
    console.log(error);
  }
});

router.get("/about.json", async (req, res, next) => {
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

router.get("/", (req, res) => {
  res.status(200).send("It works");
});

router.post("/webhooks/twitter", (req, res) => {
  const { crc_token } = req.query;
  const crc_response = crypto
    .createHmac("sha256", process.env.TWITTER_APP_SECRET)
    .update(crc_token)
    .digest("base64");
  res.status(200).json({ response_token: `sha256=${crc_response}` });
});

router.post("/webhooks/twitch", (req, res) => {
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

async function get_twitch_bearer() {
  await axios({
    method: "post",
    url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_APP_ID}&client_secret=${process.env.TWITCH_APP_SECRET}&grant_type=client_credentials`,
  }).then((r) => {
    return r.data["access_token"];
  });
}

router.post("/webhooks/twitch/create-webhook", async (req, res) => {
  const temp_bearer = get_twitch_bearer();
  const target_type = req.body["target_type"];
  const body = {
    type: req.body["webhook_type"],
    version: "1",
    condition: {},
    transport: {
      method: "webhook",
      callback: "",
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
    console.log(r.data);
    res.status(200).send(r.data);
  });
});

router.post("/webhooks/twitch/get-webhook", async (req, res) => {
  const temp_bearer = await get_twitch_bearer();
  console.log(temp_bearer);
  res.send("");
  /*
  await axios({
    method: "get",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: { 'Authorization': `Bearer ${temp_bearer}`,
          "Client-ID": "vi9za74j91x41dxvhmdsyjzau002xe" },
  }).then((r) => {
      console.log(r.data)
      res.status(200).send(r.data)
  })
*/
});

router.post("/webhooks/twitter/create", (req, res) => {});

module.exports = router;
