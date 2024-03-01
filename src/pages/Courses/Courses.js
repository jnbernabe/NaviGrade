// src/components/Courses.js

import React from 'react';

const Courses = ({ userCourses }) => {
  return (
    <div className="container mt-5">
      <h2>Your Courses</h2>
      {userCourses.length > 0 ? (
        <ul className="list-group">
          {userCourses.map(course => (
            <li key={course.id} className="list-group-item">
              <h4>{course.name}</h4>
              <p>Professor: {course.professor}</p>
              <p>Schedule: {course.schedule}</p>
              {/* Add other course details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available. Add courses to get started!</p>
      )}
    </div>
  );
};

export default Courses;
