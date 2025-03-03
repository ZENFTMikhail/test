import React, {useState, useEffect} from "react";
import { Modal, Box, styled, Button } from "@mui/material";



const Profile = () => {
    const [userData, setUser] = useState(null);
    const [open, setOpen] = useState(false)
    const [author, setAuthor] = useState('');
    const [authorID ,setAuthorId] = useState();
    const [step1, setStep1] = useState(false);
    const [step2, setStep2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState(null);
    const [resultText, setResultText] = useState('');
  
  
  
  
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
              <CustomButtonSubmit variant="outlined" onClick={update}>Update</CustomButtonSubmit>
            </div>
          </div>
          
        ) : (
          <p>Loading...</p>
        )} 
        <div>
        {resultText ? <h2>{resultText}</h2> : <p>[here is place for concatenated result from long running call]</p>}
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

  export const CustomButtonSubmit = styled(Button)({
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
  

  export default Profile;