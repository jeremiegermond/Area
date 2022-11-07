const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");

const GOOGLE_CLIENT_ID = '257681430348-9r8vob0chstjb5to7atf9mr25fllnvkv.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: String,
  password: String,
  googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User2 = mongoose.model("User1", userSchema);
passport.use(User2.createStrategy());

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  console.log(profile)
  User2.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(err, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});