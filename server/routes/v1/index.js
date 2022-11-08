const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Services = require("../../models/v1/services.js");
const { db } = require("../../models/v1/action.js");
const User = require("../../models/v1/user");
const crypto = require("crypto");
const utils = require("../../utils.js");

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res) => {
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
  passport.authenticate("login", async (err, user) => {
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

router.post("/addService", (req, res) => {
  utils
    .addService(req.body)
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

router.post("/addAction", (req, res) => {
  try {
    utils.addAction(req.body).then(() => {
      res.status(201).json({
        message: `Action added successfully to service ${req.body.service}!`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

router.post("/addReaction", async (req, res) => {
  utils
    .addReaction(req.body)
    .then(() => {
      res.status(201).json({
        message: `Reaction added successfully to service ${req.body.service}!`,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error });
    });
});

router.get("/ping", async (req, res) => {
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

router.get("/ping2", async (req, res) => {
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
router.use("/twitch", twitch);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/callback", (req, res) => {
  passport.authenticate("google", {}, async (issuer, user, profile) => {
    console.log({ user, profile });
    const token = jwt.sign({ user: user }, "TOP_SECRET");
    res.redirect(process.env.BASE_URL + ":8081/login?jwt=" + token);
  })(req, res);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Goodbye!");
});

module.exports = router;
