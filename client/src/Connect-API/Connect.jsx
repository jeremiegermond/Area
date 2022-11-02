import "./Connect.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const auth = cookies.get("TOKEN");

export default function Connect() {
  const [twitch, setTwitch] = useState(false);
  const [twitter, setTwitter] = useState(false);
  const [reddit, setReddit] = useState(false);
  const hasApi = (api, setter) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/hasApi/${api}`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        setter(res.data);
      })
      .catch((e) => {
        console.log("error", e);
      });
  };
  useEffect(() => {
    console.log();
    hasApi("reddit", setReddit);
    hasApi("twitter", setTwitter);
    hasApi("twitch", setTwitch);
  }, []);

  const handleSubmitTwitter = async (e) => {
    e.preventDefault();
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/twitter/addAccount`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data["path"];
      });
  };

  const handleSubmitReddit = async (e) => {
    e.preventDefault();
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/reddit/addAccount`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data["path"];
      });
  };

  const handleSubmitTwitch = async (e) => {
    e.preventDefault();
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/twitch/addAccount`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data["path"];
      });
  };

  return (
    <section className="connect-page">
      <h1>Connect to your API's</h1>
      <h3>By doing this, you consent the usage of your data</h3>
      <div className="api-buttons">
        <input
          type="submit"
          value="Twitch"
          className={twitch ? "api-btn-connected" : "api-btn"}
          onClick={handleSubmitTwitch}
        />
        <input
          type="submit"
          value="Reddit"
          className={reddit ? "api-btn-connected" : "api-btn"}
          onClick={(e) => handleSubmitReddit(e)}
        />
        <input
          type="submit"
          value="Twitter"
          className={twitter ? "api-btn-connected" : "api-btn"}
          onClick={handleSubmitTwitter}
        />
      </div>
      <h6>
        Back to <a href="../home">home</a>
      </h6>
    </section>
  );
}
