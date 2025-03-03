import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { CustomButtonSubmit } from "./Profile";


const SignIn = ({setLogin}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate(); 
    const handleLogin = async () => {
      try {
        const response = await fetch("http://localhost:5001/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        })
  
        const dataApi = await response.json();
        if (dataApi.success) {
          localStorage.setItem('token', dataApi.data.token);
          setLogin(true);
          navigate('/profile');
        } else {
          setError('Wrong email or password')
        }
  
      } catch (error) {
        console.error("Error auth:", error);
        setError("Server error.");
      }
  
    };
  
    return (
      <div style={{ padding: 20 }}>
        <p>Email address</p>
        <TextField label="Enter email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <p style={{marginTop: 0, color: '#C0C0C0',fontSize: 12, fontWeight: 'bold'}}>We'll never share your email with anyone else. </p>
        <p>Password</p>
        <TextField label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        {error && <p style={{ color: "red" }}>{error}</p>} 
        <CustomButtonSubmit variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: 10 }}>
          Submit
        </CustomButtonSubmit>
      </div>
    );
  }

  export default SignIn;