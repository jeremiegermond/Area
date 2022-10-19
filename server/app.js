const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongodb = require("./db/mongo");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const Users = require("./models/v1/user");
const https = require("https");
const fs = require("fs");

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

if (process.env.HTTPS === true) {
  const credentials = {
    key: fs.readFileSync((path = process.env.SSL_KEY_FILE)),
    cert: fs.readFileSync((path = process.env.SSL_CRT_FILE)),
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port);
} else {
  app.listen(port);
}

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
          user.populate("actionReaction.action").then((u) => {
            u.actionReaction.map(async (ar) => {
              if ((await ar.action.check(u)) === true)
                user.populate("actionReaction.reaction").then(async () => {
                  await ar.reaction.exec(u);
                });
            });
          });
        } catch (error) {
          console.log(error);
        }
      });
    });
  } catch (e) {
    console.log("catch error");
    console.log(e);
  }
}
setInterval(checkActions, 5 * 1000);
