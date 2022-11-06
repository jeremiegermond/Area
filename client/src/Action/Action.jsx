import "./Action.css";
import { useEffect, useState } from "react";
import { getServer } from "../api";
import { FaReddit, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Action() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  useEffect(() => {
    getServer("user/getActions")
      .then((r) => setList(r.data))
      .catch(() => console.log("Can't get action list"));
  }, []);

  return (
    <div className="action-page">
      <h1 className="action-title">When ___</h1>
      <div className="action-boxes">
        {list.map((action) => {
          const optionSet = action.options.every((o) => o?.value?.length > 0);
          const handleClick = () => {
            if (optionSet) {
              navigate("/reaction", {
                state: { id: action._id, options: action.options },
              });
            }
          };
          return (
            <div
              className={`action-box${optionSet ? " enabled" : ""}`}
              key={action._id}
              onClick={handleClick}
            >
              <div className="action-info">
                {icons[action.service.name]}
                <div>{action.name}</div>
              </div>
              <div className="option-boxes">
                {action.options.map((option) => {
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
  twitter: <FaTwitter size={40} />,
  reddit: <FaReddit size={40} />,
};
export default Action;
