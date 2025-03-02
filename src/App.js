import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button, styled, TextField, Modal, Box } from "@mui/material";
import ProtectedRoute from './ProtectedRoute';


function NavBar({login, setLogin}) {
  const navigate = useNavigate(); 
  const handleSignOut = async () => {
    const token = localStorage.getItem("token");


    try {
      const response = await fetch(`http://localhost:5001/logout?token=${token}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    localStorage.removeItem("token");
    setLogin(false);
    navigate("/");
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


function SignIn({setLogin}) {

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


function About() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Little story about the company </h1>
    </div>
  );
}


function Profile() {
  const [userData, setUser] = useState(null);
  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState('');
  const [authorID ,setAuthorId] = useState();
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [resultText, setResultText] = useState('[here is place for concatenated result from long running call]');




  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:5001/profile?token=${token}`);

        const dataUser = await response.json();
        const {data} = dataUser;
        setUser(data);

      } catch (error) {
        console.error("Error responce", error);
      }
    };

    fetchUser();
  }, []);

  async function update() {
    const token = localStorage.getItem("token");
    setOpen(true);
    setLoading(true);
    const newController = new AbortController();
    setController(newController);
  
   //Делаем первый запрос, ждем authorId
    try {
      const responce = await fetch(`http://localhost:5001/author?token=${token}`, { signal: newController.signal });
      const result = await responce.json();
      const { authorId, name } = result.data;
      console.log(name);
      setAuthorId(authorId);
      setAuthor(name);
      setStep1(true);
  
      //Делаем второй запрос после получения authorId
      const quoteResponse = await fetch(`http://localhost:5001/quote?token=${token}&authorId=${authorId}`, { signal: newController.signal });
      const quoteResult = await quoteResponse.json();
      setStep2(true);
      setResultText(`${name}: '${quoteResult.data.quote}'`)
      
    } catch (error) {
      if (error.name === "AbortError") return;
       console.error("Error req:", error);
    }  finally {
      setLoading(false);
      setController(null);
    }
  }
  const handleClose = () => {
    if (controller) {
      controller.abort();
    }
    setOpen(false);
    setLoading(false);
    setStep1(false);
    setStep2(false);
  }

  return (
    <div style={{ padding: 20 }}>
      {userData ? (
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img 
            src={userData.imgUrl} 
            alt="avatar" 
            style={{ width: 130, height: 130 , marginTop: 30}}
          />
          <div>
            <h1>Welcome, {userData.fullname}!</h1>
            <CustomButtonSubmit variant="outlined" onClick={update}>
              Update
            </CustomButtonSubmit>
          </div>
        </div>
        
      ) : (
        <p>Loading...</p>
      )} 
      <div>
      <p>{resultText}</p>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "white",
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        
        <h1>Requesting the quote </h1>
        <p>Step 1: Requesting author... {step1 && <strong>Completed</strong>}</p>

        <p>Step 2: Requesting quote... {step2 && <strong>Completed</strong>}</p>

        <CustomButtonSubmit onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
          Cansel
        </CustomButtonSubmit>
      </Box>
    </Modal>
      
    </div>
  
  );
}

function Home({info}) {
  return (
    <div style={{ padding: 20 }}>
            <p style={{fontSize: 32}} dangerouslySetInnerHTML={{ __html: info }} />

    </div>
  );
}


function App() {
  const [login, setLogin] = useState(false);
  const [info, setInfo] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogin(true);
    }
  }, []);


  useEffect(() => {
    try {
      const fetchInfo = async () => {
        const response = await fetch("http://localhost:5001/info");
        const dataAPI = await response.json();
        const { data } = dataAPI;
        console.log(data.info)
        setInfo(data.info);

      };
      fetchInfo();
     
    } catch (error) {
      console.log('Error req info');
    }
  },[])



  return (
    <Router>
    <NavBar login={login} setLogin={setLogin} />
    <Routes>
      <Route path="/"  element={<Home info={info}/>} />
      <Route path="/signin" element={<ProtectedRoute><SignIn setLogin={setLogin} /></ProtectedRoute>} />
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
