// Example in a React component

import React from 'react';
import { useAuth} from '../contexts/AuthContext';

const LogoutButton = () => {
  const { signout } = useAuth();

  return (
    <button onClick={signout}>Logout</button>
  );
};

export default LogoutButton;
