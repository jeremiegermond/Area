import { useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const auth = new Cookies().get("TOKEN");

export default function Twitch() {
  const navigate = useNavigate();
  useEffect(() => {
    const { code } = queryString.parse(window.location.search);
    if (code) {
      try {
        axios({
          method: "post",
          url: `${process.env.REACT_APP_API_URL}/user/twitch/callback`,
          headers: { Authorization: `Bearer ${auth}` },
          data: {
            code,
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
