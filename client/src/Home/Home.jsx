import "./Home.css";
import HomeBox, { Box } from "../Component/Home-Box";
import { useEffect, useState } from "react";
import { getServer } from "../api";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  useEffect(() => {
    getServer("user/getActionReaction").then((r) => setList(r.data));
  }, []);
  const filterList = (id: string) => {
    setList(list.filter(({ _id }) => _id !== id));
  };
  return (
    <div className="home-content">
      <h1>Select or edit your action</h1>{" "}
      <div className="home-container">
        {list.map((e) => {
          return (
            <HomeBox key={e._id} data={e} onDelete={() => filterList(e._id)} />
          );
        })}
      </div>
      <div className="home-container">
        <Box onClick={() => navigate("/action")}>
          <FaPlusCircle size={80} />
        </Box>
      </div>
    </div>
  );
}
