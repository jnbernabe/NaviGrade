//Assignments.js
import React from 'react';


const Assignments = () => {
  const assignments = [
    
    // Add more assignments as needed
  ];

  return (
    <div className="assignments-container">
      <h2>Upcoming Assignments</h2>
      
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>
            <div>
              <h3>{assignment.name}</h3>
              <p>Course: {assignment.course}</p>
              <p>Due Date: {assignment.dueDate}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Assignments;
