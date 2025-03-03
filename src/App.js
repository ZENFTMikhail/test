import React, { useEffect, useState } from "react";
import { BrowserRouter as Router} from "react-router-dom";
import AppRouter from "./routes/AppRoutes.js";
import NavBar from "./components/Navbar.jsx";


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
      <AppRouter login={login} setLogin={setLogin} info={info} />
    </Router>
  );
}






export default App;
