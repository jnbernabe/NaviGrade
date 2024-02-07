import React from 'react';
import './assignments.css';

const Assignments = () => {
  const assignments = [
    { id: 1, course: 'Mathematics', name: 'Algebra Assignment', dueDate: '2024-02-01' },
    { id: 2, course: 'Science', name: 'Biology Lab Report', dueDate: '2024-02-10' },
    { id: 3, course: 'History', name: 'Research Paper', dueDate: '2024-02-15' },
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
