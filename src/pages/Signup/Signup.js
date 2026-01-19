// SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Signup.css';

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async () => {
    try {
      setError(null);

      const success = await signup(email, password, firstName, lastName);

      if (success) {
        // The context handles navigation to dashboard, or we can do it here if context returns success
        // Context currently navigates to dashboard, so this component will unmount.
      } else {
        setError('Signup failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <button type="button" className="signup-button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
        {successMessage && <div className="mt-3 text-center text-success">{successMessage}</div>}
        {error && <div className="mt-3 text-center text-danger">{error}</div>}
      </div>
    </div>
  );
};
export default SignUp;