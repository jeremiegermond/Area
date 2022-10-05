import './Login.css';
import { FaTwitter, FaGoogle, FaFacebook } from 'react-icons/fa';

function Home() {
  return (
    <div className="home">
      <div className='login-box'>
        <h1 className='title'>Login</h1>
        <div className='login-box-btns'>
          <input type='text' placeholder='Username' className='btn' />
          <input type='password' placeholder='Password' className='btn' />
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
        </div>
        <a href="../connect-api">
          <input type="submit" value='Login' className='login-btn' />
        </a>
      </div>
    </div>
  );
}

export default Home;
