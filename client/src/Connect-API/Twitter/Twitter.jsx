import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

export default class Twitter extends React.Component {

    componentDidMount() {
        const {oauth_token, oauth_verifier} = queryString.parse(window.location.search);  
        if (oauth_token && oauth_verifier) {
          try {
             axios({
               url: `http://localhost:8080/twitter/callback`,  
               method: 'POST',
               data: {oauth_token, oauth_verifier}
             })
             window.location.href = "http://localhost:8081/connect-api/"
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