import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './Home/Home'
import ConnectAPI from './Connect-API/Connect';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/connect-api" element={<ConnectAPI/>}/>
        <Route path="*" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;