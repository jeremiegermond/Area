import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Register from './Register/Register'
import Login from './Login/Login'
import ConnectAPI from './Connect-API/Connect';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/connect-api" element={<ConnectAPI/>}/>
      </Routes>
    </Router>
  );
}

export default App;