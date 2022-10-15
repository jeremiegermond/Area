const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongodb = require("./db/mongo");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const Users = require("./models/v1/user");
const Action = require("./models/v1/action");
const Reaction = require("./models/v1/reaction");
//const https = require('https');
//const fs = require('fs');

/* const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}; */

require("./auth/auth");

const port = process.env.PORT || 8080;
mongodb.initDbConnection();

const routes = require("./routes/v1/index");
const secureRoute = require("./routes/v1/secure-index");

const app = express();
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());

app.use(
  cors({
    credentials: true,
  })
);

app.use("/", routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoute);

app.listen(port);

console.log(`Server listening on port ${port}`);


function checkActions() {
  try {
    Users.find({}, (err, users) => {
      if (err) {
        console.log("found err");
        console.log(err);
      }
      users.forEach((user) => {
        try {
          console.log(user.username)
          user.populate("actionReaction.action").then(() => {
            user.actionReaction.map(async (ar) => {
              console.log(ar.action)
              if (await ar.action.check() == true)
                console.log(">>> reaction")
                //user.populate("actionReaction.reaction").then(() => { 
                //  ar.reaction.exec()
                //})
            })
          })
        } catch(error) {
        console.log(error)
        }
      });
    });
  } catch (e) {
    console.log("catch error");
    console.log(e);
  }
}
setInterval(checkActions, 5 * 1000);
