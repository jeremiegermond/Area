import './Home.css';
import { FaTwitter, FaGoogle, FaFacebook } from 'react-icons/fa';

function Home() {
  return (
    <div className="home">
      <div className='register-box'>
        <h1 className='title'>Register</h1>
        <div className='register-box-btns'>
          <input type='text' placeholder='Username' className='btn'></input>
          <input type='password' placeholder='Password' className='btn'></input>
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
      </div>
    </div>
  );
}

export default Home;
