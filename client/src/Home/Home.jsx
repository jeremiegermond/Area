import "./Home.css";
import HomeBox from "../Component/Home-Box";
import { FaUser } from "react-icons/fa";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Home() {
  const logout = (e) => {
    cookies.remove("TOKEN");
    window.location.href = "/login";
    return false;
  };

  return (
    <section className="home-page">
      <div className="home-header">
        <a className="home-api" href="../connect-api">
          Connect another API
        </a>
        <a className="home-username" href="../Home">
          <div className="icon">
            <FaUser />
          </div>
          Username
        </a>
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
