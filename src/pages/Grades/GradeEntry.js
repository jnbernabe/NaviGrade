// GradeEntry.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const GradeEntry = () => {
  const { getAuthToken, userDetails } = useAuth();
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [grades, setGrades] = useState({});
  const userInfo = JSON.parse(userDetails);

  useEffect(() => {
    fetchCompletedAssignments();
  }, []);

  const fetchCompletedAssignments = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `http://localhost:5050/completed-assignments/${userInfo.id}`,
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

  const handleGradeChange = (assignmentId, event) => {
    const { value } = event.target;
    setGrades((prevGrades) => ({
      ...prevGrades,
      [assignmentId]: value,
    }));
  };

  const saveGrades = async () => {
    try {
      const token = getAuthToken();
      // Convert grades object to an array of {assignmentId, grade} objects
      const gradeEntries = Object.entries(grades).map(([assignmentId, grade]) => ({
        assignmentId,
        grade: parseInt(grade), // Ensure grade is parsed as an integer
      }));
      await axios.post(
        `http://localhost:5050/grades`,
        {
          grades: gradeEntries,
          studentId: userInfo.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Grades saved successfully!");
      // Optionally, you can navigate to another page after saving grades
    } catch (error) {
      console.error("Error saving grades:", error);
      alert("Failed to save grades");
    }
  };

  const estimateFinalGrades = async () => {
    try {
      const token = getAuthToken();
      await axios.post(
        `http://localhost:5050/estimate-grades`,
        {
          studentId: userInfo.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Final grades estimated successfully!");
    } catch (error) {
      console.error("Error estimating final grades:", error);
      alert("Failed to estimate final grades");
    }
  };

  return (
    <div>
      <h2>Grade Entry</h2>
      <form onSubmit={saveGrades}>
        {completedAssignments.map((assignment) => (
          <div key={assignment._id}>
            <h3>{assignment.name}</h3>
            <label htmlFor={`grade-${assignment._id}`}>Grade:</label>
            <input
              type="number"
              id={`grade-${assignment._id}`}
              value={grades[assignment._id] || ""}
              onChange={(e) => handleGradeChange(assignment._id, e)}
              required
            />
          </div>
        ))}
        <button type="submit">Save Grades</button>
      </form>
      <button onClick={estimateFinalGrades}>Estimate Final Grades</button>
    </div>
  );
};

export default GradeEntry;
