import './Login.css';
import { FaTwitter, FaGoogle, FaFacebook } from 'react-icons/fa';
import React from 'react';
import axios from 'axios';

export default class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }

  handleChange = event => {
    const {name , value} = event.target;
    this.setState({ [name] : value });
  }

  handleSubmit = event => {
    event.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password
    };
    console.log(user)
    axios.post('http://localhost:8080/login', user)
    .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }
  render() {
    return (
      <div className="home">
        <div className='login-box'>
          <h1 className='title'>Login</h1>
          <form className='login-box-btns'>
            <label htmlFor='username'></label>
            <input type='text' name='username' placeholder='Username' className='btn' onChange={this.handleChange} required/>
            <label htmlFor='password'></label>
            <input type='password' name='password' placeholder='Password' className='btn' onChange={this.handleChange} required/>
            <div className='separator'>
              <div className='line'></div> 
              <p> or </p> 
              <div className='line'></div> 
            </div>
            <div className='login-box-icons'>
              <FaTwitter className='icon' />
              <FaGoogle className='icon' />
              <FaFacebook className='icon' />
            </div>
          </form>
          <input type="submit" value='Login' className='login-btn' onClick={this.handleSubmit}/>
        </div>
      </div>
    );
  }
}
