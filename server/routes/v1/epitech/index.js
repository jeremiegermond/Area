const express = require("express");
const User = require("../../../models/v1/user");
const axios = require("axios");
const UserKeys = require("../../../models/v1/userkeys");
const router = express.Router();

router.post("/callback", async (req, res) => {
  const { code } = req.body;
  try {
    await User.findOne({ username: req.user.username }).then(async (user) => {
      new UserKeys({
        service: "reddit",
        keys: map,
      })
        .save()
        .then((key) => {
          console.log(user);
          user.keys.push(key);
          user.save().then(() => {
            console.log(`Reddit key added to ${user.username}`);
            res.status(201).json({
              message: `response`,
            });
          });
        });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;
