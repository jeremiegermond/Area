const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Services = require('../../models/v1/services.js');
const Action = require('../../models/v1/action.js')
const Reaction = require('../../models/v1/reaction.js')
const mongodb = require('../../db/mongo');
const { db } = require('../../models/v1/action.js');
const { mongo } = require('mongoose');
const User = require('../../models/v1/user')
const OAuth = require('oauth')

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
        ).then((data) => { 
            newAction.service = data.value._id
        })
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
        ).then((data) => { 
            newReaction.service = data.value._id
        })
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
            {name: "test"}
        );
        console.log(result)
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

router.get('/ping2', async (req, res, next) => {
  return res.status(200).json(true);
})

router.get(
  '/exist/:name', async (req, res) => {
    const {name} = req.params;
    try {
      console.log(name);
      const user = await User.findOne({username: name});
      if (user) {
        return res.status(200).json(true);
      }
      return res.status(201).json(false);
    } catch (error) {
      console.log(error)
    }
  }
);

router.post('/addReaction')

const consumer = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  "YXBMV1ocZP8RVrjZako3BlhhI",
  "oCVtXQ2eAB2zQxFYYhtkQ1O1QZGj68g4A0rG5NK7LUIMfLley2",
  '1.0A', "http://localhost:8081/connect-api/twitter", 'HMAC-SHA1'
)

router.post(
  '/twitter/callback', function(req, res) {
    try {
      console.log("oauthRequestToken "+req.body['oauth_token']);
      console.log("oauth_verifier "+req.body['oauth_verifier']);
      consumer.getOAuthAccessToken(req.body['oauth_token'], null ,req.body['oauth_verifier'], function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      console.log(error);
      res.status(500).send(error + " " + results);
    } else {
      console.log(oauthAccessToken + " " + oauthAccessTokenSecret)
      // TODO : Lier les calls a un user (pas possible atm vu qu'on a pas d'auth sur le front) + stocker les 2 clés dans la db link a l'user
      res.status(200)
    }
      });
    } catch (error) {
      console.log(error)
    }
  }
)

  router.get(
  '/twitter/addAccount', function(req, res){
    consumer.getOAuthRequestToken(function(error, oauthRequestToken, oauthRequestTokenSecret, results){
      if (error) {
        console.log(error)
        res.status(500).send({error:"Error getting OAuth request token : " + error});
      } else {  
        res.status(200).send({"path" : "https://twitter.com/oauth/authenticate?oauth_token="+oauthRequestToken+"&oauth_token_secret="+oauthRequestTokenSecret})
      }
    }); 
  });

module.exports = router;