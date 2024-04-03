//Assignments.js
import React, { useState, useEffect } from "react";
import "./assignments.css";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import AssignmentItem from "../../components/AssignmentItem";
import Modal from "react-bootstrap/Modal";
import CompletedAssignments from "./CompletedAssignments";
import { Card, Container, Col, Row, ButtonGroup } from "react-bootstrap";
import ToastPopup from "../../components/ToastPopup";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const { user, userDetails } = useAuth(AuthProvider);
  const { getAuthToken } = useAuth();
  const toggleShowA = () => setShowA(!showA);
  const toggleShowB = () => setShowB(!showB);

  //sorting function
  const [sortBy, setSortBy] = useState("dueDate"); // Default sorting by dueDate
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [showGradeSortButton, setShowGradeSortButton] = useState(false);

  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  const userInfo = JSON.parse(userDetails);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        //console.log("Fetching assignments...");
        const apiKey = process.env.REACT_APP_API_KEY;
        const response = await axios.get(
          `${apiKey}/assignments/student/${userInfo.id}`
        );
        //console.log("Assignments fetched successfully:", response.data);
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

        // Check if completed assignments have grades
        const hasGrades = updatedAssignments.some(
          (assignment) => assignment.completed && assignment.grade !== undefined
        );
        setShowGradeSortButton(hasGrades);



      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, [assignments, userInfo.id]);

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
      let response = await axios.post(
        `${apikey}/completed-assignments/${id}/mark-completed`
      );
      if (response.status === 201) {
        setAssignments((prevAssignments) =>
          prevAssignments.filter((assignment) => assignment._id !== id)
        );
        //alert("Assignment marked as completed successfully!");
        toggleShowA();
      }
    } catch (error) {
      console.error("Error marking assignment as completed:", error);
      alert("Failed to mark assignment as completed");
    }
  };
  // Rest of the code...
  const handleSortChange = (value) => {
    if (value === sortBy) {
      // If already sorted by this value, toggle sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new value, set new sort value and default sorting order to ascending
      setSortBy(value);
      setSortOrder("asc");
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === "dueDate") {
      // Sort by dueDate
      return sortOrder === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sortBy === "priority") {
      // Sort by priority (from high number to low number)
      return sortOrder === "asc"
        ? b.priority - a.priority
        : a.priority - b.priority;
    }
    return 0;
  });




  return (
   
    <>
    <Container>
    <Row>
    <Col>
      <h2 className="text-center">Upcoming Assignments </h2>
       {/* for {userInfo.firstName} */}
      <Link to="/addassignment">
        <Button className="d-block mx-auto">Add New Assignment</Button>
      </Link>
    </Col>
    
    
     <Col>
      <h2 className="text-center">Completed Assignments</h2>
      <p className="text-center">

{assignments.filter(assignment => assignment.completed).length == 0 ? (
          <>
            No Assignments Completed
          </>
        ) : (
          <>
            Congrats, {userInfo.firstName}!
            <p className="fs-1">
          {/* {assignments.filter(assignment => assignment.completed).length} */}
          {assignments.filter(assignment => assignment.completed).length}/{assignments.length}
        </p>
        Assignments Completed
          </>
        )}
      </p>




      
    </Col> 
  </Row>
      <Row>
        <Col>
          <div className="assignments-container">
            <ButtonGroup>
              <Button
                variant="success"
                onClick={() => handleSortChange("dueDate")}
              >
                Sort by Due Date
              </Button>
              <Button
                variant="info"
                onClick={() => handleSortChange("priority")}
              >
                Sort by Priority
              </Button>
            </ButtonGroup>
            {sortedAssignments
              .filter((assignment) => assignment.completed === false)
              .map((assignment) => (
                <Card
                  key={assignment._id}
                  className="assignment-card"
                  style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
                  bsPrefix
                >
                  <AssignmentItem
                    assignment={assignment}
                    studentId={userInfo.id}
                  />
                  <ButtonGroup>
                    <Button
                      variant="danger"
                      onClick={() => handleShowConfirmation(assignment._id)}
                    >
                      Delete
                    </Button>
                    <Button href={`/editassignment/${assignment._id}`}>
                      Edit
                    </Button>
                    <Button
                      variant="success"
                      onClick={() =>
                        markAssignmentAsCompleted(assignment._id)
                      }
                    >
                      Mark as Completed
                    </Button>
                  </ButtonGroup>
                </Card>
              ))}
          </div>
          <Modal
            show={showConfirmation}
            onHide={handleCloseConfirmation}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this assignment?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCloseConfirmation}
              >
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
          <ToastPopup show={showA} />
        </Col>

        <Col>
          <CompletedAssignments />
        </Col>
      </Row>
    </Container>
  </>
  );
};

export default Assignments;
