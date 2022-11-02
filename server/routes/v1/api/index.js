const express = require("express");
const User = require("../../../models/v1/user");
const UserKeys = require("../../../models/v1/userkeys");
const router = express.Router();

router.get("/hasApi/:api", async (req, res) => {
  const { api } = req.params;
  await User.findOne({ username: req.user.username })
    .populate("keys")
    .then((user) => {
      res.status(200).json(!!user.keys.find(({ service }) => service === api));
    });
});

router.delete("/deleteApi/:api", async (req, res) => {
  try {
    const { api } = req.params;
    await User.findOne({ username: req.user.username })
      .populate("keys")
      .then(async (user) => {
        console.log(user.keys.filter(({ service }) => service !== api));
        user.keys
          .filter(({ service }) => service === api)
          .forEach((key) => UserKeys.deleteOne({ _id: key.id }).then());
        user.keys = user.keys.filter(({ service }) => service !== api);
        await user.save().then(() => res.status(200).send("Api deleted"));
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: e,
    });
  }
});

module.exports = router;
