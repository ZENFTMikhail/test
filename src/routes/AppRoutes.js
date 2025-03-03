import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/Home.jsx";
import About from "../components/About.jsx";
import Profile from "../components/Profile.jsx";
import SignIn from "../components/Signin.jsx";
import ProtectedRoute from "./ProtectedRoute.js";

const AppRouter = ({ login, setLogin, info }) => {
  return (
    <Routes>
      <Route path="/" element={<Home info={info}/>} />
      <Route path="/about" element={<About />} />
      <Route
        path="/signin"
        element={!login ? <SignIn setLogin={setLogin} /> : <Navigate to="/profile" />}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute login={login}><Profile /></ProtectedRoute>}
      />
    </Routes>
  );
};

export default AppRouter;
