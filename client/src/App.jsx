import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

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
import Download from "./Download/Download";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/connect-api" element={
          <ProtectedRoutes>
            <ConnectAPI />
          </ProtectedRoutes>
          } 
        />
        <Route exact path="/connect-api/twitter" element={
          <ProtectedRoutes>
            <Twitter />
          </ProtectedRoutes>
          }
        />
        <Route exact path="/connect-api/reddit" element={
          <ProtectedRoutes>
            <Reddit />
          </ProtectedRoutes>
          } 
        />
        <Route exact path="/connect-api/twitch" element={
          <ProtectedRoutes>
            <Twitch />         
          </ProtectedRoutes>
          }
        />
        <Route exact path="/action" element={
          <ProtectedRoutes>
            <Action />
          </ProtectedRoutes>
          } 
        />
        <Route exact path="/reaction" element={
          <ProtectedRoutes>
            <Reaction />
          </ProtectedRoutes>
          } 
        />
        <Route exact path="/home" element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route exact path="/base.apk" element={<Download />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
