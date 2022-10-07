import './Home.css';

function Connect() {
  return (
    <section className='connect-page'>
      <h1>Connect to your API's</h1>
      <h3>By doing this, you consent the usage of your data</h3>
      <div className='api-buttons'>
          <input type="submit" value='Google' className='api-btn' />
          <input type="submit" value='Facebook' className='api-btn' />
          <input type="submit" value='Twitter' className='api-btn' />
      </div>
    </section>
  );
}

export default Connect;
