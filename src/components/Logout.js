// Example in a React component

import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
  const { signout } = useAuth();

  useEffect(() => {
    signout();
  }, []);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
