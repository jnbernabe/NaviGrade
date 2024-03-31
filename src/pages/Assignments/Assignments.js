//Assignments.js
import React, { useState, useEffect } from "react";
import "./assignments.css";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import AssignmentItem from "../../components/AssignmentItem";
import Modal from "react-bootstrap/Modal";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
  const { user, userDetails } = useAuth(AuthProvider);
  const userInfo = JSON.parse(userDetails);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/assignments/student/${userInfo.id}`
      );
      const fetchedAssignments = response.data;

      const updatedAssignments = await Promise.all(
        fetchedAssignments.map(async (assignment) => {
          const courseResponse = await axios.get(
            `${apiKey}/courses/${assignment.course}`
          );
          const courseName = courseResponse.data.name;
          return { ...assignment, course: courseName };
        })
      );

      setAssignments(updatedAssignments);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`;
  };

  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = (id) => {
    setAssignmentIdToDelete(id);
    setShowConfirmation(true);
  };

  const deleteAssignment = async (id) => {
    try {
      const apikey = process.env.REACT_APP_API_KEY;
      const response = await axios.delete(`${apikey}/assignments/${id}`);
      if (response.status === 200) {
        window.location.href = "/assignments";
      } else {
        alert("Failed to delete grade.");
      }
    } catch {
      console.error("Error:");
      alert("Failed to delete grade.");
    }
  };



  const markAssignmentAsCompleted = async (id) => {
    try {
      const apikey = process.env.REACT_APP_API_KEY;
      await axios.post(`${apikey}/completed-assignments/${id}/mark-completed`);
      // Refresh assignments after marking as completed
      fetchAssignments();
    } catch (error) {
      console.error("Error marking assignment as completed:", error);
      alert("Failed to mark assignment as completed");
    }
};


// const markAssignmentAsCompleted = async (id) => {
//   try {
//     const apikey = process.env.REACT_APP_API_KEY;
//     await axios.post(`${apikey}/completed-assignments/${id}/mark-completed/${userInfo.id}`);
//     // Trigger estimation of grades
//     estimateGrades();
//     // Refresh assignments after marking as completed
//     fetchAssignments();
//   } catch (error) {
//     console.error("Error marking assignment as completed:", error);
//     alert("Failed to mark assignment as completed");
//   }
// };

// const estimateGrades = async () => {
//   try {
//     const apikey = process.env.REACT_APP_API_KEY;
//     await axios.get(`${apikey}/estimate-grade/${userInfo.id}`);
//     // Optionally, you can update the state with the newly estimated grades
//     // setEstimatedGrades(newGrades);
//   } catch (error) {
//     console.error("Error estimating grades:", error);
//     // Handle error
//   }
// };


  return (
    <div className="assignments-container">
      <h2>Upcoming Assignments for {userInfo.Fname}</h2>
      <Link to="/addassignment">
        <Button>Add</Button>
      </Link>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id}>
            <AssignmentItem assignment={assignment} studentId={userInfo.id} />
            <Button
              variant="danger"
              onClick={() => handleShowConfirmation(assignment._id)}
            >
              Delete
            </Button>
            <Link to={`/editassignment/${assignment._id}`}>
              <Button>Edit</Button>
            </Link>
            <Button
              variant="success"
              onClick={() => markAssignmentAsCompleted(assignment._id)}
            >
              Mark as Completed
            </Button>
          </li>
        ))}
      </ul>
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this assignment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => deleteAssignment(assignmentIdToDelete)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Assignments;


