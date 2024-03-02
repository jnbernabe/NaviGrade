// Example in a React component

import React from 'react';
import { useHistory } from 'react-router-dom';

const LogoutButton = () => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      // Make a POST request to the server to logout
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            // Include the token in the Authorization header
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        // Include any necessary authentication tokens or credentials
      });

      // Assuming a successful logout, redirect to the home page or login page
      if (response.ok) {
        // Redirect to the home page
        localStorage.removeItem('jwtToken');
        history.push('/login');
      } else {
        // Handle logout failure
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
