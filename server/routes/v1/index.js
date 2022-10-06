const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Services = require('../../models/v1/services.js');
const Action = require('../../models/v1/action.js')
const Reaction = require('../../models/v1/reaction.js')

const router = express.Router();

router.post( '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

router.post( '/login',
    async (req, res, next) => {
        passport.authenticate( 'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }
                    req.login( user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);
                            const body = { _id: user._id, username: user.username };
                            const token = jwt.sign({ user: body }, 'TOP_SECRET');
                            return res.json({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        ) (req, res, next);
    }
);

router.post('/addService', (req, res, next) => {
    const newReaction =  new Reaction({name:"raction1", description:"desc", endpointUrl:"endpoint"})
    const newAction = new Action({name:"action1", description:"desc", endpointUrl:"endpoint", expectedResponse:"200"})
    newReaction.save()
    newAction.save()
    const newService  = new Services({
        name:"test",
        description:"testdesc",
        appKeys:{"public": "1234", "private": "5678"}, 
        actions: newAction,
        reactions: newReaction})
    newService.save().then(
      () => {
        res.status(201).json({
          message: 'Service saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

module.exports = router;