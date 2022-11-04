import "./Connect.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

export default function Connect() {
  const auth = new Cookies().get("TOKEN");
  const [twitch, setTwitch] = useState(false);
  const [twitter, setTwitter] = useState(false);
  const [reddit, setReddit] = useState(false);
  const [epitech, setEpitech] = useState(false);

  const addApi = (api) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/${api}/addAccount`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data["path"];
      });
  };
  useEffect(() => {
    const hasApi = (api, setter) => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/user/hasApi/${api}`, {
          headers: { Authorization: `Bearer ${auth}` },
        })
        .then((res) => {
          setter(res.data);
        })
        .catch(() => {
          console.log(`Couldn't get ${api} status`);
        });
    };
    hasApi("reddit", setReddit);
    hasApi("twitter", setTwitter);
    hasApi("twitch", setTwitch);
    hasApi("epitech", setEpitech);
  }, [auth]);

  return (
    <section className="connect-page">
      <h1>Connect to your API's</h1>
      <h3>By doing this, you consent the usage of your data</h3>
      <div className="api-buttons">
        <input
          type="submit"
          value="Twitch"
          className={twitch ? "api-btn-connected" : "api-btn"}
          onClick={() => addApi("twitch")}
        />
        <input
          type="submit"
          value="Reddit"
          className={reddit ? "api-btn-connected" : "api-btn"}
          onClick={() => addApi("reddit")}
        />
        <input
          type="submit"
          value="Twitter"
          className={twitter ? "api-btn-connected" : "api-btn"}
          onClick={() => addApi("twitter")}
        />
        <Link
          to="epitech"
          value="Epitech"
          className={epitech ? "api-btn-connected" : "api-btn"}
        >
          Epitech
        </Link>
      </div>
      <h6>
        Back to <Link to="/home">home</Link>
      </h6>
    </section>
  );
}
