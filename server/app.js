const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongodb = require('./db/mongo')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
require('./auth/auth');

const port = process.env.PORT || 8080
mongodb.initDbConnection()

const routes = require('./routes/v1/index');
const secureRoute = require('./routes/v1/secure-index');

const app = express();
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(logger('dev'))
app.use(express.json())
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}))

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})