import './Action.css';
import Box from "../Component/Home-Box"

export default function Action() {
  return (
    <section className='action-page'>
      <h1 className='action-title'>When ___</h1>
      <div className='action-boxes'>
        <Box />
        <Box />
        <Box />
      </div>
    </section>
  );
}
