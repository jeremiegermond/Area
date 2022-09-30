const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/v1/user');
const bcrypt = require('bcryptjs')

passport.use( 'signup',
    new localStrategy( {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const name = req.body.name
                const firstname = req.body.firstname
                const user = await UserModel.create({ name, firstname, email, password });
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use( 'login',
    new localStrategy( {
        usernameField: 'email',
        passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user)
                    return done(null, false, { message: 'User not found' });
                const isValidPassword = await user.isValidPassword(password);
                if (!isValidPassword)
                    return done(null, false, { message: 'Wrong Password' });
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                console.log(`error while login ${email} ${password} : ${error}`)
                return done(error);
            }
        }
    )
);

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);