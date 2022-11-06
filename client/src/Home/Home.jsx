import "./Home.css";
import HomeBox from "../Component/Home-Box";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { removeCookie } from "../cookie";

export default function Home() {
  const logout = async () => {
    await removeCookie("TOKEN");
    window.location.href = "/login";
    return false;
  };

  return (
    <section className="home-page">
      <div className="home-header">
        <Link to="/connect-api" className="home-api">
          Connect another API
        </Link>
        <Link className="home-username" to="/home">
          <div className="icon">
            <FaUser />
          </div>
          Username
        </Link>
        <button onClick={logout} className="logout">
          Logout
        </button>
      </div>
      <h1>Select or edit your action</h1>
      <div className="home-container">
        <HomeBox />
        <HomeBox />
        <HomeBox />
        <HomeBox />
      </div>
    </section>
  );
}
