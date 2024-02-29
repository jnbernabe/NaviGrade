// app.js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import Assignments from './pages/Assignments/Assignments';
import AuthenticationPage from './components/AuthenticationPage';
import Login from './components/Login'; 
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <>
      <nav>
        <ul>
          {user ? (
            <>
              {/* <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/assignments">Assignments</Link></li> */}
            </>
          ) : (
            <>
              <li><Link to="/authentication/signin">Sign In</Link></li>
              <li><Link to="/authentication/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
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


