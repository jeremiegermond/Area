const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/v1/user');

passport.use( 'signup',
    new localStrategy( {
        usernameField: 'username',
        passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.create({ username, password });
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use( 'login',
    new localStrategy( {
        usernameField: 'username',
        passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username });
                if (!user)
                    return done(null, false, { message: 'User not found' });
                const isValidPassword = await user.isValidPassword(password);
                if (!isValidPassword)
                    return done(null, false, { message: 'Wrong Password' });
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
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
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        console.log(error)
        done(error);
      }
    }
  )
);