



const Home = ({info}) => {
    return (
      <div style={{ padding: 20 }}>
              <p style={{fontSize: 32}} dangerouslySetInnerHTML={{ __html: info }} />
  
      </div>
    );
  }

  export default Home;