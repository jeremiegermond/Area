import React from "react";
import axios from "axios";
import queryString from "query-string";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const auth = cookies.get("TOKEN");

export default class Twitter extends React.Component {
  componentDidMount() {
    const { oauth_token, oauth_verifier } = queryString.parse(
      window.location.search
    );
    if (oauth_token && oauth_verifier) {
      try {
        axios({
          method: "post",
          url: `${process.env.REACT_APP_API_URL}/user/twitter/callback`,
          headers: { Authorization: `Bearer ${auth}` },
          data: {
            oauth_token,
            oauth_verifier,
          },
        }).then(() => {
          window.location.href = `${process.env.REACT_APP_CALLBACK_URL}/connect-api/`;
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
  render() {
    return null;
  }
}
