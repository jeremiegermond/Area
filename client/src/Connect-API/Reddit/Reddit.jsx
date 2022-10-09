import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

export default class Reddit extends React.Component {

    componentDidMount() {
        const {code} = queryString.parse(window.location.search);
        if (code) {
          try {
            axios({
              method: 'post',
              url: 'http://localhost:8080/user/reddit/callback',
              headers: {"Authorization" : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzM2YwYzJhMmY4NDZhNjE1MzdkNmRhOSIsInVzZXJuYW1lIjoiY3VydGlzc3MifSwiaWF0IjoxNjY1MzU4MjY5fQ.sULwrnpXSvAePsCiaiPNbzpiq5x8DqaNH4U5BWsMYXo`},
              data: {
                code
              }
            }).then(() => {
                console.log('stl');
                //window.location.href = "http://localhost:8081/connect-api/"
                }
            )
          } catch (error) {
           console.error(error); 
          }
          //window.location.href = "http://localhost:8081/connect-api/"
      }
    }
      render() {
        return null
      }
}