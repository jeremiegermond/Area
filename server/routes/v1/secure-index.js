const express = require('express');
const router = express.Router();
/* const OAuth = require('oauth')

const consumer = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  "YXBMV1ocZP8RVrjZako3BlhhI",
  "oCVtXQ2eAB2zQxFYYhtkQ1O1QZGj68g4A0rG5NK7LUIMfLley2",
  '1.0A', "http://localhost:8080/callback", 'HMAC-SHA1'
)
*/
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

/* router.get(
'/callback', function(req, res) {
  try {
console.log("oauthRequestToken "+req.query.oauth_token);
console.log("oauth_verifier "+req.query.oauth_verifier);
consumer.getOAuthAccessToken(req.query.oauth_token, null ,req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
  if (error) {
    console.log(error);
    res.status(500).send(error + " " + results);
  } else {      
      res.status(200).send({oauthAccessToken: oauthAccessToken, oauthAccessTokenSecret: oauthAccessTokenSecret})
        }
    });
  } catch (error) {
    console.log(error)
  }
}
)
router.get(
'/addTwitter', function(req, res){
  consumer.getOAuthRequestToken(function(error, oauthRequestToken, oauthRequestTokenSecret, results){
    if (error) {
      console.log(error)
      res.status(500).send({error:"Error getting OAuth request token : " + error});
    } else {  
      console.log("oauthRequestToken "+oauthRequestToken);
      console.log("oauthRequestTokenSecret "+oauthRequestTokenSecret);
      res.status(200).redirect("https://twitter.com/oauth/authorize?oauth_token="+oauthRequestToken+"&oauth_token_secret="+oauthRequestTokenSecret)
    }
  }); 
}); */

module.exports = router;
