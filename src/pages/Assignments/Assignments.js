//Assignments.js
import React, { useState, useEffect } from "react";
import "./assignments.css";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "../../services/mockApi";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import AssignmentItem from "../../components/AssignmentItem";
import Modal from "react-bootstrap/Modal";
import EditAssignmentModal from "./EditAssignmentModal";

import CompletedAssignments from "./CompletedAssignments";
import {
  Card,
  Container,
  Col,
  Row,
  ButtonGroup,
  ProgressBar,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignmentProgressbar from "../../components/AssignmentProgressbar";

export const calculateStudentLevel = (completedPercentage) => {
  if (completedPercentage >= 90) {
    return "🚀 Superstar!";
  } else if (completedPercentage >= 80) {
    return "🌟 Acing it!";
  } else if (completedPercentage >= 70) {
    return "🎉 Rocking it!";
  } else if (completedPercentage >= 60) {
    return "😎 Doing great!";
  } else if (completedPercentage >= 50) {
    return "🤩 Solid effort!";
  } else if (completedPercentage >= 40) {
    return "👏 Getting there!";
  } else if (completedPercentage >= 30) {
    return "🤔 Needs a boost!";
  } else if (completedPercentage >= 20) {
    return "😅 Room for improvement!";
  } else if (completedPercentage >= 10) {
    return "😬 Getting tough!";
  } else {
    return "😢 Struggling";
  }
};

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, userDetails } = useAuth(AuthProvider);
  const { getAuthToken } = useAuth();
  //sorting function
  const [sortBy, setSortBy] = useState("dueDate"); // Default sorting by dueDate
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [showGradeSortButton, setShowGradeSortButton] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const handleEditClick = (assignment) => {
      setEditingAssignment(assignment);
      setShowEditModal(true);
  };

  const handleAssignmentUpdate = (updatedAssignment) => {
      console.log("Updating assignment list state", updatedAssignment);
      setAssignments(prev => prev.map(a => a._id === updatedAssignment._id ? updatedAssignment : a));
  };
  
  const handleAssignmentDelete = (id) => {
      setAssignments((prev) => prev.filter(a => a._id !== id));
      toast("Assignment deleted");
  };

  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  const userInfo = JSON.parse(userDetails);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        //console.log("Fetching assignments...");
        const apiKey = process.env.REACT_APP_API_KEY;
        const response = await axios.get(
          `${apiKey}/assignments/student/${userInfo._id}`
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
  }, [userInfo._id]);

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
        setAssignments((prev) => prev.filter(a => a._id !== id));
        setShowConfirmation(false);
        toast("Assignment deleted");
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

      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) => 
            assignment._id === id ? { ...assignment, completed: true } : assignment
        )
      );
      toast(`Assignment marked as completed`);
    } catch (error) {
      console.error("Error marking assignment as completed:", error);
      toast("Failed to mark assignment as completed");
    }
  };
  // sort
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

  // Calculate percentage of completed assignments
  const completedPercentage = Math.round(
    (assignments.filter((assignment) => assignment.completed).length /
      assignments.length) *
      100
  );

  const notifyClosestAssignment = () => {
    if (assignments.length === 0) {
      toast("No assignments currently.");
      return;
    }

    // Sort assignments by dueDate in ascending order
    const sortedAssignments = [...assignments].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    // Get the closest assignment (first one in the sorted list)
    const closestAssignment = sortedAssignments[0];

    const today = new Date();
    const dueDate = new Date(closestAssignment.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Display a toast with information about the closest assignment
    toast(`Closest assignment: ${closestAssignment.name}  
    ${diffDays} day(s) left`);
  };

  const markAssignmentIncomplete = async (id) => {
    try {
      const apikey = process.env.REACT_APP_API_KEY;
      await axios.put(
        `${apikey}/completed-assignments/${id}/mark-incomplete`,
        { completed: false }
      );
      
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) => 
            assignment._id === id ? { ...assignment, completed: false } : assignment
        )
      );
      toast("Assignment marked as incomplete");
    } catch (error) {
      console.error("Error marking assignment as incomplete:", error);
      toast("Failed to mark assignment as incomplete");
    }
  };

  return (
    <>
      <Container className="py-4">
        <Row className="mb-5 justify-content-center">
          <Col md={8} className="text-center">
            {assignments.filter((assignment) => assignment.completed).length == 0 ? (
              <div className="p-4 glass-panel text-muted">No Assignments Completed Yet</div>
            ) : (
                <div className="p-4 glass-panel">
                 <h2 className="display-6 mb-0">Congrats, {userInfo.firstName}!</h2>
                 <div className="my-3">
                    <span className="display-4 fw-bold text-primary">
                    {assignments.filter((assignment) => assignment.completed).length}
                    </span>
                    <span className="fs-4 text-muted mx-2">/</span>
                    <span className="fs-4 text-muted">{assignments.length}</span>
                 </div>
                 <div className="text-uppercase tracking-wider fs-6 text-secondary fw-bold">Assignments Completed</div>
                </div>
            )}
          </Col>
        </Row>

        <Row className="g-5"> {/* Added gutter for better spacing */}
          <Col lg={6} className="d-flex flex-column">
            <div className="d-flex flex-column align-items-center">
                <h2 className="text-center mb-3 display-6" style={{ fontFamily: 'var(--font-header)' }}>Upcoming</h2>
                
                <div className="d-flex gap-2 flex-wrap justify-content-center mb-3">
                     <Link to="/addassignment" className="text-decoration-none">
                        <Button variant="primary" className="d-flex align-items-center gap-2">
                            <span>+ New</span>
                        </Button>
                     </Link>
                     <Button variant="outline-success text-white" onClick={() => handleSortChange("dueDate")}>
                        Date
                     </Button>
                     <Button variant="outline-info text-white" onClick={() => handleSortChange("priority")}>
                        Priority
                     </Button>
                </div>
            </div>

            <div className="assignments-grid flex-grow-1">
              {sortedAssignments
                .filter((assignment) => assignment.completed === false)
                .map((assignment) => (
                  <Card
                    key={assignment._id}
                    className="assignment-card"
                    bsPrefix="card"
                  >
                    <AssignmentItem
                      assignment={assignment}
                      studentId={userInfo._id}
                    />
                    <ButtonGroup className="mt-3 w-100 bg-dark-glass rounded-pill overflow-hidden border border-white border-opacity-10">
                      <Button
                        variant="link"
                        className="text-danger text-decoration-none"
                        onClick={() => handleShowConfirmation(assignment._id)}
                      >
                        Delete
                      </Button>
                      <Button 
                        variant="link" 
                        onClick={() => handleEditClick(assignment)}
                        className="text-white text-decoration-none border-start border-end border-secondary border-opacity-25"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        className="text-success text-decoration-none"
                        onClick={() =>
                          markAssignmentAsCompleted(assignment._id)
                        }
                      >
                        Complete
                      </Button>
                    </ButtonGroup>
                  </Card>
                ))}
                {sortedAssignments.filter(a => !a.completed).length === 0 && (
                    <div className="text-center text-muted py-5 border border-dashed border-secondary rounded-3">
                        No upcoming assignments
                    </div>
                )}
            </div>
            
            <EditAssignmentModal 
                show={showEditModal} 
                onHide={() => setShowEditModal(false)} 
                assignment={editingAssignment}
                onUpdate={handleAssignmentUpdate}
                onDelete={handleAssignmentDelete}
            />

            <Modal show={showConfirmation} onHide={handleCloseConfirmation} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this assignment?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseConfirmation}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteAssignment(assignmentIdToDelete)}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>

          <Col lg={6} className="d-flex flex-column border-lg-start border-secondary border-opacity-10">
             {/* Completed Assignments Section */}
             <div className="d-flex flex-column align-items-center">
                 <h2 className="text-center mb-3 display-6" style={{ fontFamily: 'var(--font-header)' }}>Completed</h2>
             </div>
             <CompletedAssignments 
                assignments={assignments.filter(a => a.completed)}
                onMarkIncomplete={markAssignmentIncomplete}
             />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Assignments;
