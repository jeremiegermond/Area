import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

export default class Twitter extends React.Component {

    componentDidMount() {
        const {oauth_token, oauth_verifier} = queryString.parse(window.location.search);
        if (oauth_token && oauth_verifier) {
          try {
            axios({
              method: 'post',
              url: 'http://localhost:8080/user/twitter/callback',
              headers: {"Authorization" : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzNDIxZmZmNThmM2YyM2QyMWE2ZWNjZiIsInVzZXJuYW1lIjoiZ2FyZW4ifSwiaWF0IjoxNjY1Mjc3OTU1fQ.dcj7k56yHI1pNImLSGwgcGORmNuKV4DHfOngvZ84fO0`}, 
              data: {
                oauth_token, oauth_verifier
              }
            }).then(() => {console.log('stl');window.location.href = "http://localhost:8081/connect-api/"})
          } catch (error) {
           console.error(error); 
          }
        } else {
            window.location.href = "http://localhost:8081/connect-api/"
        }
      }
      render() {
        return null
      }
}

/*
axios({
              method: 'post',
              url: 'http://localhost:8080/user/twitter/callback',
              headers: {"Authorization" : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzNDBjMDQyYzg4ZTQxOTgwNDRmNjU3NyIsInVzZXJuYW1lIjoiZ2FyZW5sb2wifSwiaWF0IjoxNjY1MjM2Nzg2fQ.hcoxOiuo6o1x3CVcoxFxaZWXUvt_9BAYrOQXXQznD_Q`}, 
              data: {
                oauth_token, oauth_verifier
              }
            }); */