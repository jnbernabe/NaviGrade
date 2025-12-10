// components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const success = await signin(email, password);

      if (success) {
        // Redirect to the home page after successful login
        navigate('/');
      } else {
        // Display an error message to the user indicating the login failure
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during signin:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
        </form>
        {error && <div className="mt-3 text-center"><p className="text-danger">{error}</p></div>}
        <div className="card-footer text-center">
          <p>Don't have an account? <Link to="/students/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;