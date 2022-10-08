const express = require('express');
const router = express.Router();
const mongodb = require('../../db/mongo');
const User = require('../../models/v1/user.js');
const Services = require('../../models/v1/services.js');
const Action = require('../../models/v1/action.js')
const Reaction = require('../../models/v1/reaction.js')
const UserKeys = require('../../models/v1/userkeys.js')
const OAuth = require('oauth')

router.get(
  '/profile',
  (req, res, next) => {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
);

router.post('/addActionReaction', async (req, res, next)  => {
    try {
      const { service, action_id, reaction_id } = req.body
      let act = await Action.findById(action_id)
      let react = await Reaction.findById(reaction_id)
      let usr = await User.findOne({name: req.user.name})
      console.log(usr)
      usr.actionReaction.push({
        action: act._id,
        reaction: react._id
      })
      usr.save().then(() => {
        res.status(201).json({
          message: `action ${act.name} and reaction ${react.name} successfully added to user ${req.user.name}`
        })
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        error: error
      })
    }
})

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
      consumer.getOAuthAccessToken(req.body['oauth_token'], null ,req.body['oauth_verifier'], async (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error) {
          console.log(error);
          res.status(500).send(error + " " + results);
        } else {
          let usr = await User.findOne({name: req.user.name})
          console.log(usr.keys)
          console.log(oauthAccessToken + " " + oauthAccessTokenSecret)
          const newUserKeys = new UserKeys({
            service: "twitter",
            public_key: oauthAccessToken.toString(),
            private_key: oauthAccessTokenSecret.toString()
          }).save().then((data) => {
            usr.keys.push(data)
            usr.save().then(() => {
              res.status(201).json({
                message: `response`
              })
            })
          })
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
        res.status(200).send({"path" : "https://twitter.com/oauth/authorize?oauth_token="+oauthRequestToken+"&oauth_token_secret="+oauthRequestTokenSecret})
      }
    }); 
  });

module.exports = router;
