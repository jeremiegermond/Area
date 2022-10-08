import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Register from './Register/Register'
import Login from './Login/Login'
import ConnectAPI from './Connect-API/Connect';
import Home from './Home/Home'
import Twitter from './Connect-API/Twitter/Twitter'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/connect-api" element={<ConnectAPI/>}/>
        <Route exact path="/connect-api/twitter" element={<Twitter/>}/>
        <Route exact path="/home" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;