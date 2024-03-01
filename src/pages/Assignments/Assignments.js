import React, { useState, useEffect } from 'react';
import './assignments.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);



  useEffect(() => {
    fetchAssignments();
  
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5050/assignments');
      const fetchedAssignments = response.data;

      // Fetch course names for each assignment
      const updatedAssignments = await Promise.all(
        fetchedAssignments.map(async assignment => {
          const courseResponse = await axios.get(`http://localhost:5050/courses/${assignment.course}`);
          const courseName = courseResponse.data.name;
          return { ...assignment, course: courseName };
        })
      );

      setAssignments(updatedAssignments);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  //Format Due Date
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    return `${month}/${day}/${year}`;
  };

  
  const deleteAssignment = (id) => {
    //Comment out for now to avoid deleting 
    // const updatedAssignment = assignments.filter(assignment => assignment._id !== id);
    // setAssignments(updatedAssignment);
};

  return (
    <div className="assignments-container">
      <h2>Upcoming Assignments</h2>
      <Link to="/addassignment">
      <Button>Add</Button>
      </Link>
       <ul>
          {assignments.map(assignment => (
                <li key={assignment._id}>
                  <div>
                    <h3>{assignment.name}</h3>
                  <p>Course Name:  {assignment.course}</p>
                  <p>Due Date:  {formatDateToMDYY(assignment.dueDate)}</p>
                  <p>Weight:  {(assignment.weight)}</p>
                  <p><Link to={`/editassignment/${assignment._id}`}>Edit</Link></p>
                  <Button variant ="danger" onClick={()=> deleteAssignment(assignment._id)}>Delete</Button>
                  </div>

                  
                </li>
              ))}
       </ul>
    </div>
  );
};

export default Assignments;
