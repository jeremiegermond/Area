const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Services = require("../../models/v1/services.js");
const Action = require("../../models/v1/action.js");
const Reaction = require("../../models/v1/reaction.js");
const mongodb = require("../../db/mongo");
const { db } = require("../../models/v1/action.js");
const { mongo } = require("mongoose");
const User = require("../../models/v1/user");


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
})

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

router.post('/addService', (req, res, next) => {
    const { name, desc, appKeys } = req.body
    const map = new Map
    appKeys.split(',').forEach((elem) => {
      map.set(elem.substr(0, elem.indexOf(':')), elem.substr(elem.indexOf(':') + 1))
    })
    const newService  = new Services({
        name: name,
        description: desc,
        appKeys: map,
    })
    newService.save().then(
      () => {
        res.status(201).json({
          message: 'Service saved successfully!'
        });
      }
    ).catch(
      (error) => {
        console.log(error)
        res.status(400).json({
          error: error
        });
      }
    );
});

router.post('/addAction', async (req, res, next)  => {
    try {
        const { service, name, desc, method, endpointUrl, header, expectedResponse } = req.body
        const newAction =  new Action({name: name, description: desc, method: method, endpointUrl: endpointUrl, header: header, expectedResponse: expectedResponse})
        let result = await db.collection("services").findOneAndUpdate(
            {name: service},
            {$push: {actions: newAction._id}},
            {new: true}
        ).then((data) => { 
            newAction.service = data.value._id
        })
        newAction.save().then(
            () => {
                res.status(201).json({
                    message: `Action added successfully to service ${service}!`
                });
            }
        ).catch(
          (error) => {
            console.log(error)
            res.status(400).json({error: error});
          }
        );
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error});
    }
})

router.post('/addReaction', async (req, res, next)  => {
    try {
        const { service, name, method, desc, header, endpointUrl } = req.body
        const newReaction =  new Reaction({name: name, description: desc, method: method, endpointUrl: endpointUrl, header: header})
        let result = await db.collection("services").findOneAndUpdate(
            {name: service},
            {$push: {reactions: newReaction._id}},
            {new: true}
        ).then((data) => { 
            newReaction.service = data.value._id
        })
        newReaction.save().then(
            () => {
                res.status(201).json({
                    message: `Reaction added successfully to service ${service}!`
                });
            }
        ).catch(
          (error) => {
            console.log(error)
            res.status(400).json({error: error});
          }
        );
    } catch (error) {
        console.log(error)
        res.status(400).json({
          error: error
        })
    }
})

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

module.exports = router;
