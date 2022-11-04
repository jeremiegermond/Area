import { useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const auth = new Cookies().get("TOKEN");

export default function Twitter() {
  const navigate = useNavigate();
  useEffect(() => {
    const { oauth_token, oauth_verifier } = queryString.parse(
      window.location.search
    );
    console.log({ oauth_token, oauth_verifier });
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
          navigate("/connect-api", { replace: true });
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [navigate]);
  return null;
}
