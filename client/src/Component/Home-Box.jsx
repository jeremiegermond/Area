import './Home-Box.css';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

export default function HomeBox() {
  return (
    <div className='box'>
      <div className='box-icons'>
        <FaPencilAlt />
        <FaTrashAlt />
      </div>
      <p className='box-text'>Action ...</p>
    </div>
  );
}
