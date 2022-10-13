import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Register from './Register/Register'
import Login from './Login/Login'
import ConnectAPI from './Connect-API/Connect';
import Home from './Home/Home'
import Twitter from './Connect-API/Twitter/Twitter'
import Reddit from './Connect-API/Reddit/Reddit'
import ProtectedRoutes from './Component/ProtectedRoutes'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/connect-api" element={<ConnectAPI/>}/>
        <Route exact path="/connect-api/twitter" element={<Twitter/>}/>
        <Route exact path="/connect-api/reddit" element={<Reddit/>}/>
        <Route exact path="/home" element={<ProtectedRoutes/>}>
          <Route exact path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;