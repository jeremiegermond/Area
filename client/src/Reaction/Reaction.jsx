import "../Action/Action.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServer, postServer } from "../api";
import { icons } from "../Action/Action";

function Reaction() {
  const navigate = useNavigate();
  const location = useLocation();
  const [list, setList] = useState([]);
  useEffect(() => {
    getServer("user/getReactions")
      .then((r) => setList(r.data))
      .catch(() => console.log("Can't get reaction list"));
  }, []);
  const convertParams = (arr: []) => {
    return arr.map((item) => `${item.name}:${item.value}`).join();
  };
  return (
    <div className="action-page">
      <h1 className="action-title">Do ___</h1>
      <div className="action-boxes">
        {list.map((reaction) => {
          const optionSet = reaction.options?.every(
            (o) => o?.value?.length > 0
          );
          const handleClick = () => {
            if (optionSet) {
              postServer("user/addActionReaction", {
                action_id: location.state.id,
                reaction_id: reaction._id,
                action_params: convertParams(location.state.options),
                reaction_params: convertParams(reaction.options ?? []),
              })
                .then(() => navigate("/home"))
                .catch(() => console.log("Error adding action-reaction"));
            }
          };
          return (
            <div
              className={`action-box${optionSet ? " enabled" : ""}`}
              key={reaction._id}
              onClick={handleClick}
            >
              <div className="action-info">
                {icons[reaction.service.name]}
                <div>{reaction.name}</div>
              </div>
              <div className="option-boxes">
                {reaction.options?.map((option) => {
                  const handleChange = (e) => {
                    setList(
                      list.map((item) => {
                        if (item._id === reaction._id) {
                          return {
                            ...item,
                            options: reaction.options.map((newOption) => {
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

export default Reaction;
