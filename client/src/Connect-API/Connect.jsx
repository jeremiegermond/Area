import './Connect.css';
import React from 'react';
import axios from 'axios';

export default class Connect extends React.Component {

  handleSubmitTwitter = async event => {
    event.preventDefault();
    await axios.get('http://localhost:8080/user/twitter/addAccount', { headers: {"Authorization" : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzNDIxZmZmNThmM2YyM2QyMWE2ZWNjZiIsInVzZXJuYW1lIjoiZ2FyZW4ifSwiaWF0IjoxNjY1Mjc3OTU1fQ.dcj7k56yHI1pNImLSGwgcGORmNuKV4DHfOngvZ84fO0`} })
    .then(res => {
        console.log(res.status);
        console.log(res.data);
        window.location.href = res.data['path']
      })
  }
  

  render() {
    return (
      <section className='connect-page'>
        <h1>Connect to your API's</h1>
        <h3>By doing this, you consent the usage of your data</h3>
        <div className='api-buttons'>
            <input type="submit" value='Google' className='api-btn' />
            <input type="submit" value='Facebook' className='api-btn' />
            <input type="submit" value='Twitter' className='api-btn' onClick={this.handleSubmitTwitter}/>
        </div>
      </section>
    );
  }
}