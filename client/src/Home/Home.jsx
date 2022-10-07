import './Home.css';
import HomeBox from '../Component/Home-Box';
import { FaUser } from 'react-icons/fa';

export default function Home() {
  return (
    <section className='home-page'>
      <div className='home-header'>
        <a className='home-api' href='../connect-api'>Connect another API</a>
        <a className='home-username' href='../Home'>
          <div className='icon'><FaUser /></div>
          Username
        </a>
      </div>
      <h1>Select or edit your action</h1>
      <div className='home-container'>
        <HomeBox />
        <HomeBox />
        <HomeBox />
        <HomeBox />
      </div>
    </section>
  );
}
