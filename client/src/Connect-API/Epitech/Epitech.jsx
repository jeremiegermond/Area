import "./Epitech.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { postServer } from "../../api";

export default function Epitech() {
  const navigate = useNavigate();
  const [cookie, setCookie] = useState("");

  function handleSubmit() {
    postServer("user/epitech/callback", { user_cookie: cookie })
      .then(() => navigate("/connect-api", { replace: true }))
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
