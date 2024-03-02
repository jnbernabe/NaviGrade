// app.js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Calendar from './pages/Calendar/Calendar';
import Courses from './pages/Courses/Courses';
import Assignments from './pages/Assignments/Assignments';
import Navbar from './components/Navbar';
import AuthenticationPage from './components/AuthenticationPage';
import Login from './pages/Login/Login'; 
import { useAuth } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-big-calendar/lib/css/react-big-calendar.css";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calendar" element={
          <>
            <Calendar />
            <div style={{ width: "100%", height: "600px", margin: "50px"}} />
          </>} />
        {user ? (
          <>
            
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="login" element={<Login />} /> 
          </>
        ) : (
          <Route path="authentication/*" element={<AuthenticationPage />} />
        )}
      </Routes>
    </>
  );
}

export default App;


