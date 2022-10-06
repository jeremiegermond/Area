const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Services = require('../../models/v1/services.js');
const Action = require('../../models/v1/action.js')
const Reaction = require('../../models/v1/reaction.js')
const mongodb = require('../../db/mongo');
const { db } = require('../../models/v1/action.js');
const { mongo } = require('mongoose');

mongodb.initDbConnection()
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
    const { name, desc, publicKey, privateKey } = req.body
    const newService  = new Services({
        name: name,
        description: desc,
        appKeys:{public: publicKey, private: privateKey},
    })
    newService.save().then(
      () => {
        res.status(201).json({
          message: 'Service saved successfully!'
        });
      }
    ).catch(
      (error) => {
        console.log(error)
        res.status(400).json({
          error: error
        });
      }
    );
});

router.post('/addAction', async (req, res, next)  => {
    try {
        const { service, name, desc, endpointUrl, expectedResponse } = req.body
        const newAction =  new Action({name: name, description: desc, endpointUrl: endpointUrl, expectedResponse: expectedResponse})
        let result = await db.collection("services").findOneAndUpdate(
            {name: service},
            {$push: {actions: newAction._id}},
            {new: true}
        );
        newAction.save().then(
            () => {
                res.status(201).json({
                    message: `Action added successfully to service ${service}!`
                });
            }
        ).catch(
          (error) => {
            console.log(error)
            res.status(400).json({error: error});
          }
        );
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error});
    }
})

router.post('/addReaction', async (req, res, next)  => {
    try {
        const { service, name, desc, endpointUrl } = req.body
        const newReaction =  new Reaction({name: name, description: desc, endpointUrl: endpointUrl})
        let result = await db.collection("services").findOneAndUpdate(
            {name: service},
            {$push: {reactions: newReaction._id}},
            {new: true}
        );
        newReaction.save().then(
            () => {
                res.status(201).json({
                    message: `Reaction added successfully to service ${service}!`
                });
            }
        ).catch(
          (error) => {
            console.log(error)
            res.status(400).json({error: error});
          }
        );
    } catch (error) {
        console.log(error)
        res.status(400).json({
          error: error
        })
    }
})

router.get('/ping', async (req, res, next) => {
    try {
        let result = await db.collection("services").findOne(
            {name: "test"},
        );
        let ping = await db.collection("actions").findOne({_id: result.actions[0]})
        console.log(ping)
        res.status(201).json({
            message: `Ping "test".actions !`
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
          error: error
        })
    }
})

router.post('/addReaction')


module.exports = router;