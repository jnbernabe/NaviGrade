// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const checkState = localStorage.getItem("token") ? true : false;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(checkState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const TOKEN_KEY = "token";

  // Function to set the authentication token in localStorage
  const setAuthToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  };

  // Function to get the authentication token from localStorage
  const getAuthToken = () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  };

  // Function to remove the authentication token from localStorage
  const removeAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  const signout = async () => {
    try {
      // Make a POST request to the server to logout
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(`${apiKey}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the token in the Authorization header
          Authorization: `Bearer ${getAuthToken()}`,
        },
        // Include any necessary authentication tokens or credentials
      });

      // Assuming a successful logout, redirect to the home page or login page
      if (response.ok) {
        // Redirect to the home page
        setUser(null);
        removeAuthToken();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      setLoading(true);
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(`${apiKey}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const responseData = await response.json(); // This line captures the response data
      console.log("Response data:", responseData);
      if (response.ok) {
        console.log("Signup successful. User data:", responseData);
        setAuthToken(responseData.token);
        setUser(responseData);
        navigate("/home");
        return true;
      } else {
        const errorData = await response.json();
        console.error("Error during signup:", response.statusText, errorData);
        return false;
      }
    } catch (error) {
      console.error("Error during signup:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signin = async (email, password) => {
    try {
      // // Obtain the token from localStorage
      const token = getAuthToken();

      if (token !== null) {
        console.log(token);
        console.error(
          "User Logged in already. Please logout to login with another account"
        );
        return false;
      }
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(`${apiKey}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      // Check if the response is successful (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log("Sign in successful. User data:", data);
        setAuthToken(data.token);
        setUser(data);
        navigate("/home");
      } else {
        console.error(
          "Login failed. Please check your credentials." + response.statusText
        );
      }

      return response.ok;
    } catch (error) {
      console.error("Error during signin:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signout,
        signup,
        signin,
        loading,
        getAuthToken,
        setAuthToken,
        removeAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
