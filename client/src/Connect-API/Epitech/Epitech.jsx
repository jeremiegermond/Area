import "./Epitech.css";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const auth = new Cookies().get("TOKEN");

export default function Epitech() {
  const navigate = useNavigate();
  const [cookie, setCookie] = useState("");

  function handleSubmit() {
    axios
      .post(
        "http://localhost:8080/user/epitech/callback",
        {
          user_cookie: cookie,
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      )
      .then(() => {
        navigate("/connect-api", { replace: true });
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  return (
    <div className="epitech-page">
      <div className="how-to">
        <img src="/get_cookies.png" alt="How to get your cookie" />
        <a href="https://intra.epitech.eu" target="_blank" rel="noreferrer">
          Get your cookie
        </a>
      </div>
      <div className="epitech-form">
        <input
          className="text-input"
          type="text"
          onChange={(e) => setCookie(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          value={cookie}
        />
        <input
          className="button"
          type="button"
          value="Add Epitech cookie"
          maxLength={300}
          disabled={cookie.length <= 100}
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </div>
  );
}
