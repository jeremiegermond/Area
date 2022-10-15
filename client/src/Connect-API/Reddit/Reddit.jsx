import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const auth = cookies.get("TOKEN")

export default class Reddit extends React.Component {

    componentDidMount() {
        const {code} = queryString.parse(window.location.search);
        if (code) {
          try {
            axios({
              method: 'post',
              url: 'http://localhost:8080/user/reddit/callback',
              headers: {"Authorization" : `Bearer ${auth}`},
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