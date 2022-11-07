const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Services = require("../../models/v1/services.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");
const Api_call = require("../../models/v1/api_call.js");
const Webhook = require("../../models/v1/webhook");
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

async function addApiAction(body) {
  const interleave = (arr, x) => arr.flatMap((e) => [e, x]).slice(0, -1);
  const {service, name, desc, method, endpointUrl, header, rbody, trigger, userKey, options} = body;
  console.log(userKey);
  let trigger_arr = trigger.split(/(&&|\|\|)/);
  trigger_arr.forEach((elem, index) => {
    if (elem !== "&&" || elem !== "||") trigger_arr[index] = elem.split(",");
  });
  console.log(trigger_arr);
  const newApi_call = new Api_call({
    method: method,
    endpointUrl: endpointUrl,
    header: header,
    body: rbody,
    trigger: trigger_arr,
    userKey: userKey === "true"
  })
  await newApi_call.save()
  return newApi_call
}

async function addWebhookAction (body) {
  const {target_type, webhook_type, condition_value} = body;
  return await new Webhook({
    target_type: target_type,
    webhook_type: webhook_type,
    condition_value: condition_value
  }).save()
}

router.post("/addAction", async (req, res, next) => {
  try {
    const {service, name, desc, method, endpointUrl, header, rbody, trigger, userKey, options} = req.body;
    const newAction = new Action({
      name: name,
      description: desc,
      options: JSON.parse(options),
      webhook: typeof method === 'undefined' ? await addWebhookAction(req.body) : null,
      api_call: typeof method !== 'undefined' ? await addApiAction(req.body) : null
    });
    console.log(method)
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
    newAction.save().then(() => { return true})
      .catch((error) => {
        console.log(error);
        return false
      });
    res.status(201).json({
      message: `Action added successfully to service ${req.body.service}!`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

router.post("/addReaction", async (req, res, next) => {
  try {
    const {service, name, method, desc, header, body, endpointUrl, userKey, options} = req.body;
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



const twitch = require("./twitch/webhook");
const api_call = require("../../models/v1/api_call.js");
router.use("/twitch", twitch)


router.get('/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] })
);

router.get('/google/callback', (req, res) => {
  passport.authenticate( 'google', {},(issuer, profile, cb) => {
    console.log({issuer, profile, cb})
    const token = jwt.sign({user: {_id: profile.googleId, username: "CHANGETHIS"}}, "TOP_SECRET");
    res.redirect('http://localhost:8081/callback&jwt='+ token);
  })(req, res);
})

router.get('/logout', (req, res) => { 
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

module.exports = router;
