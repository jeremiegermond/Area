const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongodb = require("./db/mongo");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const Users = require("./models/v1/user");
const Actions = require("./models/v1/action");
const Reactions = require("./models/v1/reaction");
const ActionReaction = require("./models/v1/actionreaction");
const https = require("https");
const fs = require("fs");
const session = require("express-session");
const db_json = require("./db.json");
const utils = require("./utils.js");

require("./auth/auth");

const port = process.env.PORT || 8080;
mongodb.initDbConnection();

const routes = require("./routes/v1/index");
const secureRoute = require("./routes/v1/secure-index");
const Services = require("./models/v1/services");

const app = express();
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(
  session({
    secret: "TOP_SECRET",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());

app.use(
  cors({
    credentials: true,
  })
);

app.use("/", routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoute);

if (process.env.HTTPS === "true") {
  const credentials = {
    key: fs.readFileSync((path = process.env.SSL_KEY_FILE)),
    cert: fs.readFileSync((path = process.env.SSL_CRT_FILE)),
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port);
} else {
  app.listen(port);
}

async function build_db(file) {
  try {
    file.services.forEach(async (service) => {
      const arr = await Services.find({name: service.name})
      if (arr.length === 0)
        await utils.addService({name: service.name, desc: service.desc, appKeys: service.appKeys})
        .then(() => {
      service.actions.forEach(async (action) => {
        action.service = service.name
        const arr = await Actions.find({name: service.name})
        if (arr.length === 0)
          await utils.addAction(action)
      })
      service.reactions.forEach(async (reaction) => {
        reaction.service = service.name
        const arr = await Reactions.find({name: service.name})
        if (arr.length === 0)
          utils.addReaction(reaction)
      })})
    })
  } catch (error) {
    console.log("Server was unable to build database")
    return
  }
}
build_db(db_json);

console.log(`Server listening on port ${port}`);

async function checkActions() {
  try {
    Users.find({}, (err, users) => {
      if (err) {
        console.log("found err");
        console.log(err);
      }
      users.forEach((user) => {
        try {
          user.populate("actionReaction").then(() => {
            user.actionReaction.forEach(async (ar) => {
              await ar.populate("action");
              if (ar.action != null) {
                if (ar.webhook_uid === "")
                  if ((await ar.action.check(user, ar)) === true)
                    ar.populate("reaction").then(async () => {
                      await ar.reaction.exec(user ,ar.reaction_params);
                    });
              } else
                await ActionReaction.deleteOne({_id: ar._id})
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