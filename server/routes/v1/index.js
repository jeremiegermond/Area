const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Services = require("../../models/v1/services.js");
const Actions = require("../../models/v1/action.js");
const Reactions = require("../../models/v1/reaction.js");
const { db } = require("../../models/v1/action.js");
const User = require("../../models/v1/user");
const crypto = require("crypto");
const utils = require("../../utils.js");
var fs = require('fs');

const router = express.Router();

router.post("/signup",
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
  const {name, desc, appKeys} = req.body;
  utils
    .addService(req.body)
    .then(() => {
      try {
        fs.readFile("db.json", "utf-8", (err, data) => {
          if (err) throw err
          updtd_data = JSON.parse(data)
          updtd_data.services.push({
            "name" : name,
            "desc" : desc,
            "appKeys" : appKeys,
            "actions" : [],
            "reactions" : []
          })
          fs.writeFile("db.json", JSON.stringify(updtd_data), "utf-8", (err) => {
            if (err) throw err;
            console.log(`${name} was added to db.json`);
          })
        })
        res.status(201).json({
          message: "Service saved successfully!",
        });
      } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
});

router.post("/addAction", (req, res) => {
  utils
    utils.addAction(req.body)
    .then(() => {
      try {
        const {service, name, desc, method, options} = req.body;
        fs.readFile("db.json", "utf-8", (err, data) => {
          if (err) throw err
          new_action = {
            "name" : name,
            "desc" : desc,
            "options" : options,
          }
          updtd_data = JSON.parse(data)
          if (!method) {
            const {target_type, webhook_type, condition_value} = req.body;
            new_action = {...new_action,
            "webhook_type": target_type,
            "condition_value": webhook_type,
            "target_type": condition_value}
          } else {
            const {endpointUrl, header, body, trigger, userKey} = req.body
            new_action = {...new_action,
            "method": method,
            "endpointUrl": endpointUrl,
            "header": header,
            "body": body,
            "trigger": trigger,
            "userKey": userKey === "true"}
          }
          updtd_data.services.filter(serv => {return serv.name === service})[0].actions.push(new_action)
          fs.writeFile("db.json", JSON.stringify(updtd_data), "utf-8", (err) => {
            if (err) throw err;
            console.log(`${name} was added to db.json`);
          })
        })
        res.status(201).json({
          message: `Action added successfully to service ${req.body.service}!`,
        });
      } catch (err) {
          console.log(err)
          res.status(400).json({ error: err })
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
});

router.post("/addReaction", async (req, res) => {
  utils
    .addReaction(req.body)
    .then(() => {
      try {
        const {service, name, desc, method, options, endpointUrl, header, body, userKey} = req.body;
        fs.readFile("db.json", "utf-8", (err, data) => {
          if (err) throw err
          new_action = {
            "name" : name,
            "desc" : desc,
            "options" : options,
            "method": method,
            "endpointUrl": endpointUrl,
            "header": header,
            "body": body,
            "userKey": userKey === "true"
          }
          console.log(body)
          updtd_data = JSON.parse(data)
          updtd_data.services.filter(serv => {return serv.name === service})[0].reactions.push(new_action)
          fs.writeFile("db.json", JSON.stringify(updtd_data), "utf-8", (err) => {
            if (err) throw err;
            console.log(`${name} was added to db.json`);
          })
        })
        res.status(201).json({
          message: `Reaction added successfully to service ${req.body.service}!`,
        });
      } catch (err) {
          console.log(err)
          res.status(400).json({ error: err })
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error });
    });
});

router.delete("/removeService/:service", async (req, res) => {
  try {
    const {service} = req.params
    await Services.findOneAndDelete({name: service})
    fs.readFile("db.json", "utf-8", async (err, data) => {
      if (err) throw err
      updtd_data = JSON.parse(data)
      updtd_data.services.forEach((serv, index) => {
        if (serv.name === service)
          updtd_data.services.splice(index, 1)
      })
      console.log(updtd_data)
      fs.writeFile("db.json", JSON.stringify(updtd_data), "utf-8", (err) => {
        if (err) throw err;
        console.log(`${service} was removed from db.json`);
      })
      res.status(201).json({
        message: `${service} was removed.`,
      })
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
})

router.delete("/removeAction/:service/:action", async (req, res) => {
  try {
    const {service, action} = req.params
    await Actions.findOneAndDelete({name: action})
    fs.readFile("db.json", "utf-8", async (err, data) => {
      if (err) throw err
      updtd_data = JSON.parse(data)
      updtd_data.services.forEach((serv, index) => {
        if (serv.name === service) {
          updtd_data.services[index].actions.forEach((act, index2) => {
            if (act.name === action) {
              updtd_data.services[index].actions.splice(index2, 1)
            }
          })
        }
      })
      console.log(updtd_data)
      fs.writeFile("db.json", JSON.stringify(updtd_data), "utf-8", (err) => {
        if (err) throw err; 
        console.log(`${service} was removed from db.json`);
      })
      res.status(201).json({
        message: `${action} was removed from ${service}.`,
      })
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
})

router.delete("/removeReaction/:service/:reaction", async (req, res) => {
  try {
    const {service, reaction} = req.params
    await Reactions.findOneAndDelete({name: reaction})
    fs.readFile("db.json", "utf-8", async (err, data) => {
      if (err) throw err
      updtd_data = JSON.parse(data)
      updtd_data.services.forEach((serv, index) => {
        if (serv.name === service) {
          updtd_data.services[index].reactions.forEach((act, index2) => {
            if (act.name === reaction) {
              updtd_data.services[index].reactions.splice(index2, 1)
            }
          })
        }
      })
      console.log(updtd_data)
      fs.writeFile("db.json", JSON.stringify(updtd_data), "utf-8", (err) => {
        if (err) throw err; 
        console.log(`${service} was removed from db.json`);
      })
      res.status(201).json({
        message: `${reaction} was removed from ${service}.`,
      })
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
})

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
