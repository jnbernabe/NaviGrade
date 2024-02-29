// AuthenticationPage.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';

const AuthenticationPage = () => {
  return (
    <div>
      <h1>Welcome to NaviGrade!</h1>
      <p>Sign in or sign up to access our amazing features.</p>
      <Routes>
        <Route path="signin" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </div>
  );
};

export default AuthenticationPage;