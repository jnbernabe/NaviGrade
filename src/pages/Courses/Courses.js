import React from 'react';
import { Link } from 'react-router-dom';
import './courses.css';

const Courses = () => {
  const courses = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'History' },
    // Add more courses as needed
  ];

  return (
    <div className="courses-container">
      <h2>Available Courses</h2>
      
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={`/courses/${course.id}`}>{course.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
