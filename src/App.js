import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button, styled, TextField } from "@mui/material";


function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Little story about the company</h1>
    </div>
  );
}

function SignIn() {
  const navigate = useNavigate(); 

  const handleLogin = ({setLogin}) => {
    setLogin(true)
    navigate("/profile"); 
  };

  return (
    <div style={{ padding: 20 }}>
      <p>Email address</p>
      <TextField label="Enter email" variant="outlined"  fullWidth />
      <p style={{marginTop: 0, color: '#C0C0C0',fontSize: 12, fontWeight: 'bold'}}>We'll never share your email with anyone else. </p>
      <p>Password</p>
      <TextField label="Password" type="password" variant="outlined" fullWidth />
      <CustomButtonSubmit variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: 10 }}>
        Submit
      </CustomButtonSubmit>
    </div>
  );
}

function About() {
  return (
    <div style={{ padding: 20 }}>
      <h1>About Us</h1>
      <p>Some information about the company...</p>
    </div>
  );
}


function NavBar({login, setLogin}) {

  const handleSignOut = () => {
    setLogin(false); 
  };

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 , padding: 20}}>
      <CustomButton variant="outlined" component={Link}  to="/about">About us</CustomButton>
      
      {!login ? (
        <CustomButton variant="outlined" component={Link} to="/signin">Sign in</CustomButton>
      ) : (
        <>
          <CustomButton variant="outlined" component={Link} to="/profile">Profile</CustomButton>
          <CustomButton variant="outlined" onClick={handleSignOut}>Sign out</CustomButton>
        </>
      )}
    </div>
  );
}

function Profile() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{}}>
        <img />
        
        <h1>Welcome,{}!</h1>
        <CustomButtonSubmit variant="outlined" onClick={{}}></CustomButtonSubmit>

      </div>

    </div>
  );
}

function App() {
  const [login, setLogin] = useState(true);

  return (
    <Router>
    <NavBar login={login} setLogin={setLogin} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn setLogin={setLogin} />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={login ? <Profile /> : <SignIn setLogin={setLogin} />} />
    </Routes>
  </Router>
  );
}

const CustomButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  color: 'black',
  borderColor: 'gray'
});

const CustomButtonSubmit = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#0072db',
  color: 'white',
  borderColor: '#0072db'
})


export default App;
