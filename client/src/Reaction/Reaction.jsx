import './Reaction.css';
import Box from "../Component/Home-Box"

export default function Reaction() {
  return (
    <section className='reaction-page'>
      <h1 className='reaction-title'>Do ___</h1>
      <div className='reaction-boxes'>
        <Box />
        <Box />
        <Box />
      </div>
    </section>
  );
}
