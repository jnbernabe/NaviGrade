// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = (userData) => {
    console.log('userData:', userData); // Log user data
    const token = userData.token || '';
  
    console.log('Token received in login:', token);
    console.log('Token length:', token.length);
    console.log('Token before check:', token);
  
    // Trim the token to remove leading and trailing whitespaces
    const cleanedToken = token.trim();
  
    console.log('Token after trimming:', cleanedToken);
  
    if (cleanedToken) {
      localStorage.setItem('token', cleanedToken);
      console.log('Token stored in localStorage:', cleanedToken);
    } else {
      console.error('No token found in login data.');
    }
  
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const signup = async (email, password, firstName, lastName) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5050/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
  
      const responseData = await response.json(); // This line captures the response data
  
      if (response.ok) {
        console.log('Signup successful. User data:', responseData);
        setUser(responseData);
        navigate('/login');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error during signup:', response.statusText, errorData);
        return false;
      }
    } catch (error) {
      console.error('Error during signup:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const signin = async (email, password) => {
    try {
      // Obtain the token from localStorage
      const token = localStorage.getItem('token') || 'Zht6Nvy7Yr9Qp7KAlAIU8GzPqLUrzTSK';
  
      // Additional log statements for troubleshooting
      console.log('Attempting to sign in...');
      console.log('Token found in localStorage:', token);
      console.log('Token before check:', token);
      console.log('Token length:', token.length);
  
      // Trim the token to remove leading and trailing whitespaces
      const cleanedToken = token.trim();
  
      console.log('Token after trimming:', cleanedToken);
  
      // Check if token is present and not empty
      if (!cleanedToken) {
        console.error('No token found in localStorage.');
        return false;
      }
  
      console.log('Token before API call:', cleanedToken);
      console.log('Making API call...');
  
      const response = await fetch('http://localhost:5050/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanedToken}`,
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Additional log statement
      console.log('API call completed. Response:', response);
  
      // Check if the response is successful (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log('Sign in successful. User data:', data);
        setUser(data);
      } else {
        console.error('Login failed. Please check your credentials.');
      }
  
      return response.ok;
    } catch (error) {
      console.error('Error during signin:', error);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, signup, signin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
  
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
  
export { AuthProvider, useAuth };
