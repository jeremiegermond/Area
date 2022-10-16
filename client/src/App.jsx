import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Register from "./Register/Register";
import Login from "./Login/Login";
import ConnectAPI from "./Connect-API/Connect";
import Home from "./Home/Home";
import Twitter from "./Connect-API/Twitter/Twitter";
import Reddit from "./Connect-API/Reddit/Reddit";
import Twitch from "./Connect-API/Twitch/Twitch";
import ProtectedRoutes from "./Component/ProtectedRoutes";
import Action from "./Action/Action";
import Reaction from "./Reaction/Reaction";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/connect-api" element={<ConnectAPI />} />
        <Route exact path="/connect-api/twitter" element={<Twitter />} />
        <Route exact path="/connect-api/reddit" element={<Reddit />} />
        <Route exact path="/connect-api/twitch" element={<Twitch />} />
        <Route exact path="/action" element={<Action />} />
        <Route exact path="/reaction" element={<Reaction />} />
        <Route
          exact
          path="/home"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
