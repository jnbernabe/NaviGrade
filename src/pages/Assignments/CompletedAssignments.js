//pages/CompletedAssignments.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const CompletedAssignments = () => {
  const { getAuthToken } = useAuth();
  const [completedAssignments, setCompletedAssignments] = useState([]);

  useEffect(() => {
    fetchCompletedAssignments();
  }, []);

  const fetchCompletedAssignments = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        "http://localhost:5050/completed-assignments", // Correct endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompletedAssignments(response.data);
    } catch (error) {
      console.error("Error fetching completed assignments:", error);
    }
  };

  return (
    <div>
      <h2>Completed Assignments</h2>
      <ul>
        {completedAssignments.map((assignment) => (
          <li key={assignment._id}>
            <p>{assignment.name}</p>
            {/* Display any other details of the completed assignment */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedAssignments;
