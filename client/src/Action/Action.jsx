import "./Action.css";
import { useEffect, useState } from "react";
import { getServer } from "../api";
import { FaReddit, FaTwitch, FaTwitter } from "react-icons/fa";
import { SocialIcon } from "react-social-icons";
import { useNavigate } from "react-router-dom";

function Action() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    getServer("user/getActions")
      .then((r) => setList(r.data))
      .catch(() => console.log("Can't get action list"));
  }, []);

  const [showResults, setShowResults] = useState(false);
  const setChange = (serviceName) => {
    const allWithClass = Array.from(
      document.getElementsByClassName(serviceName)
    );
    const btnWithClass = Array.from(
      document.getElementsByClassName(serviceName + "-button")
    );

    allWithClass.forEach((element) => {
      element.style.display = "none";
    });

    if (showResults) {
      allWithClass.forEach((element) => {
        element.style.display = "none";
      });
      btnWithClass.forEach((element) => {
        element.style.border = "2px solid red";
        element.style.transform = "scale(1.00)";
      });
      setShowResults(false);
    } else {
      allWithClass.forEach((element) => {
        element.style.display = "flex";
      });
      btnWithClass.forEach((element) => {
        element.style.border = "2px solid green";
        element.style.transform = "scale(1.1)";
      });
      setShowResults(true);
    }
  };

  return (
    <div className="action-page">
      <h1 className="action-title">When ___</h1>
      <div className="action-icons">
        <button
          onClick={() => setChange("twitch")}
          className="action-background twitch-icon twitch-button"
        >
          <FaTwitch size={40} className="twitch-icon action-icon" />
        </button>
        <button
          onClick={() => setChange("twitter")}
          className="action-background twitter-icon twitter-button"
        >
          <FaTwitter size={40} className="twitter-icon action-icon" />
        </button>
        <button
          onClick={() => setChange("reddit")}
          className="action-background reddit-icon reddit-button"
        >
          <FaReddit size={40} className="reddit-icon action-icon" />
        </button>
        <button
          onClick={() => setChange("epitech")}
          className="action-background epitech-icon epitech-button"
        >
          <img
            src="/epitechlogo.png"
            alt="epitech"
            className="epitech-icon action-icon"
          />
        </button>
        <button
          onClick={() => setChange("spotify")}
          className="action-background spotify-icon spotify-button"
        >
          <SocialIcon
            network="spotify"
            size={40}
            className="spotify-icon action-icon"
          />
        </button>
      </div>
      <div className="action-boxes">
        {list.map((action) => {
          const optionSet = action.options?.every((o) => o?.value?.length > 0);
          const handleClick = () => {
            if (optionSet) {
              navigate("/reaction", {
                state: { id: action._id, options: action.options ?? [] },
              });
            }
          };
          return (
            <div
              className={`action-box${optionSet ? " enabled" : ""} ${
                showResults
                  ? action.service.name + "-show"
                  : action.service.name + "-hide"
              } ${action.service.name}`}
              key={action._id}
              onClick={handleClick}
            >
              <div className={"action-info"}>
                {icons[action.service.name]}
                <div>{action.name}</div>
              </div>
              <div className="option-boxes">
                {action.options?.map((option) => {
                  const handleChange = (e) => {
                    setList(
                      list.map((item) => {
                        if (item._id === action._id) {
                          return {
                            ...item,
                            options: action.options.map((newOption) => {
                              if (newOption.name === option.name) {
                                return { ...newOption, value: e.target.value };
                              }
                              return newOption;
                            }),
                          };
                        }
                        return item;
                      })
                    );
                  };
                  return (
                    <div
                      className="option-box"
                      key={option.name}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="option-name">{option.name}</div>
                      <input
                        className="option-input"
                        value={option.value ?? ""}
                        placeholder={option.placeholder ?? "..."}
                        onChange={handleChange}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const icons = {
  twitter: <FaTwitter size={40} className="twitter-icon" />,
  reddit: <FaReddit size={40} className="reddit-icon" />,
  twitch: <FaTwitch size={40} className="twitch-icon" />,
  spotify: <SocialIcon network="spotify" size={40} className="spotify-icon" />,
  epitech: (
    <img className="epitech-logo" src="/epitechlogo.png" alt="epitech" />
  ),
};

export default Action;