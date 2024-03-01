// AuthenticationPage.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import SignUp from '../pages/Signup/Signup';

const AuthenticationPage = () => {
  return (
    <div>
    
      <Routes>
        <Route path="signin" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </div>
  );
};

export default AuthenticationPage;