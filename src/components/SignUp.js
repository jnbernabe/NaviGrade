// SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
        setSuccessMessage('Signup successful. Redirecting to login page...');
        setTimeout(() => {
          navigate('/login'); // Use navigate for navigation
        }, 3000); // Redirect after 3 seconds
      } else {
        setError('Signup failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <button type="button" onClick={handleSignUp}>Sign Up</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default SignUp;