import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {Button, styled} from "@mui/material";



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

  export default NavBar;