import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

const cookies = new Cookies();
const auth = cookies.get("TOKEN")

export default class Twitter extends React.Component {

    componentDidMount() {
        const {oauth_token, oauth_verifier} = queryString.parse(window.location.search);
        if (oauth_token && oauth_verifier) {
          try {
            axios({
              method: 'post',
              url: 'http://localhost:8080/user/twitter/callback',
              headers: {"Authorization" : `Bearer ${auth}`},
              data: {
                oauth_token, oauth_verifier
              }
            })
          } catch (error) {
           console.error(error); 
          }
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