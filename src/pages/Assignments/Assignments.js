import React, { useState, useEffect } from "react";
import "./assignments.css";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useHistory } from 'react-router-dom';
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    //Would be nice to add error handling if a course is not available.
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`${apiKey}/assignments`);
      const fetchedAssignments = response.data;

      // Fetch course names for each assignment
      const updatedAssignments = await Promise.all(
        fetchedAssignments.map(async (assignment) => {
          const courseResponse = await axios.get(
            `${apiKey}/courses/${assignment.course}`
          );
          //console.log("courseResponse", courseResponse); //null
          const courseName = courseResponse.data.name;
          return { ...assignment, course: courseName };
        })
      );
      //console.log("updatedAssignments", updatedAssignments); //null
      setAssignments(updatedAssignments);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //console.log('assignments',assignments); //null

  //Format Due Date
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    return `${month}/${day}/${year}`;
  };

  const deleteAssignment = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this grade?"
    );
    if (confirmation) {
      try {
        const apikey = process.env.REACT_APP_API_KEY;
        const response = await axios.delete(`${apikey}/assignments/${id}`);
        if (response.status === 200) {
          //Show lert if succeed
          //alert('Assignment deleted successfully.');
          window.location.href = "/assignments";
        } else {
          alert("Failed to delete grade.");
        }
      } catch {
        console.error("Error:");
        alert("Failed to delete grade.");
      }
    }
  };

  /*return (
    <div className="assignments-container">
      <h2>Upcoming Assignments</h2>
      <Link to="/addassignment">
        <Button>Add</Button>
      </Link>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id}>
            <div>
              <h3>{assignment.name}</h3>
              <p>Course Name: {assignment.course}</p>
              <p>Due Date: {formatDateToMDYY(assignment.dueDate)}</p>
              <p>Weight: {assignment.weight}</p>
              <p>
                <Link to={`/editassignment/${assignment._id}`}>Edit</Link>
              </p>
              <Button
                variant="danger"
                onClick={() => deleteAssignment(assignment._id)}
              >
                Delete this assignment
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};*/

/* II wanted to add cards here so that it was consistent with the format of courses */
return (
  <div className="assignments-container">
    <h2>Upcoming Assignments</h2>
    <Link to="/addassignment">
      <Button>Add</Button>
    </Link>
    <div className="assignment-list">
      {assignments.map((assignment) => (
        <Card key={assignment._id} className="assignment-card">
          <Card.Body>
            <Card.Title>{assignment.name}</Card.Title>
            <Card.Text>Course Name: {assignment.course}</Card.Text>
            <Card.Text>Due Date: {formatDateToMDYY(assignment.dueDate)}</Card.Text>
            <Card.Text>Weight: {assignment.weight}</Card.Text>
        
            <Button 
              variant="primary"style={{ height: '40px' }}>
              <Link to={`/editassignment/${assignment._id}`}style={{ color: 'white'}}>Edit</Link>
            </Button>

            <Button
              variant="danger" style ={{height: '40px'}}
              onClick={() => deleteAssignment(assignment._id)}
            >
              Delete this assignment
            </Button>
            
          </Card.Body>
        </Card>
      ))}
    </div>
  </div>
);
}

export default Assignments;
