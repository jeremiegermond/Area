import './Register.css';
import { FaTwitter, FaGoogle, FaFacebook } from 'react-icons/fa';
import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

export default function Register() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const client = {
    username,
    password
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(client);
    axios.post('http://localhost:8080/signup', client)
    .then((res) => {
      setRegister(true);
      console.log(res);
      console.log(res.data);
    })
    .catch((error) => {
      error = new Error();
    });
  }

  return (
    <>
      <div className="home">
        <div className='register-box'>
          <h1 className='title'>Register</h1>
          <Form onSubmit={(e)=>handleSubmit(e)}>
            <div className='register-box-btns'>
              <Form.Group controlId="formUsername">
                <label htmlFor='username'></label>
                <input value={username} type='text' name='username' placeholder='Username' className='btn' onChange={(e) => setUser(e.target.value)} required/>
              </Form.Group>
              <Form.Group controlId="formPassword">
                <label htmlFor='password'></label>
                <input value={password} type='password' name='password' placeholder='Password' className='btn' onChange={(e) => setPassword(e.target.value)} required/>
              </Form.Group>
              <div className='separator'>
                <div className='line'></div> 
                <p> or </p> 
                <div className='line'></div> 
              </div>
              <div className='register-box-icons'>
                <FaTwitter className='icon' />
                <FaGoogle className='icon' />
                <FaFacebook className='icon' />
              </div>
            </div>
            <Button variant="primary" type="submit" className='login-btn' onClick={(e) => handleSubmit(e)}>Register</Button>
            {register ? (
              <p className="text-success">You are successfully registered</p>
            ) : (
              <p className="text-danger">You are not registered</p>
            )}
          </Form>
          <p>You already have an account ? Go to <a href="../Login">login</a></p>
        </div>
      </div>
    </>
  );
}
