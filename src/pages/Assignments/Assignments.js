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
import AddAssignmentModal from "./AddAssignmentModal";
import CompletedAssignments from "./CompletedAssignments";
import {
  Card,
  Container,
  Col,
  Row,
  Tabs,
  Tab
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const { userDetails } = useAuth(AuthProvider);
  const { getAuthToken } = useAuth();
  //sorting function
  const [sortBy, setSortBy] = useState("dueDate"); // Default sorting by dueDate
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

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

  const handleAssignmentAdd = (newAssignment) => {
      setAssignments(prev => [...prev, newAssignment]);
      toast("Assignment added successfully!");
  };
  
  const [showAddModal, setShowAddModal] = useState(false);

  // History Sorting
  const [historySortBy, setHistorySortBy] = useState("dueDate");
  const [historySortOrder, setHistorySortOrder] = useState("desc"); // Default desk for history

  const handleHistorySortChange = (value) => {
    if (value === historySortBy) {
      setHistorySortOrder(historySortOrder === "asc" ? "desc" : "asc");
    } else {
      setHistorySortBy(value);
      setHistorySortOrder("desc"); // Default to newest/highest first for history
    }
  };

  const sortedHistory = assignments
    .filter(a => a.completed)
    .sort((a, b) => {
        if (historySortBy === "dueDate") {
            return historySortOrder === "asc"
                ? new Date(a.dueDate) - new Date(b.dueDate)
                : new Date(b.dueDate) - new Date(a.dueDate);
        } else if (historySortBy === "grade") {
            return historySortOrder === "asc" ? a.grade - b.grade : b.grade - a.grade;
        }
        return 0;
    });

  return (
    <Container className="assignments-container">
      {/* Unified Command Center Header */}
      <div className="glass-panel p-4 mb-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 mb-4">
          {/* Title Section */}
          <div>
            <h1 className="display-5 fw-bold text-white mb-2">My Assignments</h1>
            <p className="text-muted mb-0 fs-5">Manage your tasks and track your progress</p>
          </div>
          
          {/* Stats Widget */}
          <div className="stats-widget ps-4 pe-3 py-2 border border-secondary border-opacity-25 rounded-pill bg-dark-glass d-inline-flex align-items-center gap-3">
            <div className="text-end">
              <div className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Completed</div>
              <div className="d-flex align-items-baseline justify-content-end gap-2">
                 <span className="display-6 fw-bold text-primary" style={{lineHeight: 1}}>
                    {assignments.filter((assignment) => assignment.completed).length}
                 </span>
                 <span className="text-muted fs-5">/ {assignments.length}</span>
              </div>
            </div>
            <div className="bg-primary bg-opacity-10 p-2 rounded-circle border border-primary border-opacity-25">
               <span className="fs-3">🏆</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Tabs (Left) & Actions (Right) */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pt-3 border-top border-secondary border-opacity-25">
          <Tabs
            id="assignment-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="custom-pills mb-0"
          >
            <Tab eventKey="upcoming" title={`Upcoming (${assignments.filter(a => !a.completed).length})`} />
            <Tab eventKey="completed" title="History" />
          </Tabs>

          {activeTab === 'upcoming' && (
             <div className="d-flex gap-2 bg-dark-glass p-1 rounded-pill border border-secondary border-opacity-10">
                <Button 
                  variant={sortBy === 'dueDate' ? 'primary' : 'ghost'}
                  className={`rounded-pill px-3 py-2 ${sortBy !== 'dueDate' && 'text-muted hover-text-white'}`}
                  onClick={() => handleSortChange("dueDate")}
                  size="sm"
                >
                  <i className="bi bi-calendar-event me-2"></i>
                  Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <div className="vr bg-secondary opacity-25 my-1"></div>
                <Button 
                  variant={sortBy === 'priority' ? 'primary' : 'ghost'}
                  className={`rounded-pill px-3 py-2 ${sortBy !== 'priority' && 'text-muted hover-text-white'}`}
                  onClick={() => handleSortChange("priority")}
                  size="sm"
                >
                  <i className="bi bi-flag me-2"></i>
                  Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↓' : '↑')} 
                </Button>
                <div className="vr bg-secondary opacity-25 my-1"></div>
                <Button 
                    variant="primary" 
                    className="rounded-pill px-4 py-1 ms-2 d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => setShowAddModal(true)}
                  >
                    <span className="fs-5">+</span> New
                </Button>
             </div>
          )}

          {activeTab === 'completed' && (
             <div className="d-flex gap-2 bg-dark-glass p-1 rounded-pill border border-secondary border-opacity-10">
                <Button 
                  variant={historySortBy === 'dueDate' ? 'primary' : 'ghost'}
                  className={`rounded-pill px-3 py-2 ${historySortBy !== 'dueDate' && 'text-muted hover-text-white'}`}
                  onClick={() => handleHistorySortChange("dueDate")}
                  size="sm"
                >
                  <i className="bi bi-calendar-event me-2"></i>
                  Date {historySortBy === 'dueDate' && (historySortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <div className="vr bg-secondary opacity-25 my-1"></div>
                <Button 
                  variant={historySortBy === 'grade' ? 'primary' : 'ghost'}
                  className={`rounded-pill px-3 py-2 ${historySortBy !== 'grade' && 'text-muted hover-text-white'}`}
                  onClick={() => handleHistorySortChange("grade")}
                  size="sm"
                >
                  <i className="bi bi-award me-2"></i>
                  Grade {historySortBy === 'grade' && (historySortOrder === 'asc' ? '↑' : '↓')}
                </Button>
             </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <Row className="justify-content-center">
        <Col xl={12}> 
          
          {activeTab === 'upcoming' && (
            <div className="upcoming-section fade-in-up">
               {/* Filter Bar Removed - Integrated above */}

               <div className="assignments-list">
                  {sortedAssignments
                    .filter((assignment) => !assignment.completed)
                    .map((assignment) => (
                      <Card
                        key={assignment._id}
                        className="assignment-card-horizontal"
                        bsPrefix="card"
                      >
                        <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center w-100">
                           <div className="flex-grow-1">
                              <AssignmentItem
                                  assignment={assignment}
                                  studentId={userInfo._id}
                              />
                           </div>
                           
                           <div className="card-actions-horizontal">
                              <Button
                                variant="link"
                                className="btn-edit-action text-decoration-none p-2"
                                onClick={() => handleEditClick(assignment)}
                                title="Edit Assignment"
                              >
                                Edit
                              </Button>
                              <div className="vr bg-secondary opacity-25 mx-1" style={{height: '24px'}}></div>
                              <Button
                                variant="link"
                                className="text-danger text-decoration-none p-2 opacity-75 hover-opacity-100"
                                onClick={() => handleShowConfirmation(assignment._id)}
                                title="Delete Assignment"
                              >
                                Delete
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                className="ms-3 px-4 rounded-pill fw-medium"
                                onClick={() => markAssignmentAsCompleted(assignment._id)}
                              >
                                Complete
                              </Button>
                           </div>
                        </div>
                      </Card>
                  ))}
                  
                  {sortedAssignments.filter(a => !a.completed).length === 0 && (
                      <div className="empty-state">
                          <h4>All caught up!</h4>
                          <p>No upcoming assignments.</p>
                          <Button variant="outline-primary" className="mt-3" onClick={() => setShowAddModal(true)}>
                              Create First Assignment
                          </Button>
                      </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="completed-section fade-in-up">
               <CompletedAssignments 
                  assignments={sortedHistory}
                  onMarkIncomplete={markAssignmentIncomplete}
               />
            </div>
          )}

        </Col>
      </Row>

      {/* Modals */}
      <AddAssignmentModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onAdd={handleAssignmentAdd}
      />

      <EditAssignmentModal 
          show={showEditModal} 
          onHide={() => setShowEditModal(false)} 
          assignment={editingAssignment}
          onUpdate={handleAssignmentUpdate}
          onDelete={handleAssignmentDelete}
      />

      <Modal 
        show={showConfirmation} 
        onHide={handleCloseConfirmation} 
        centered
        contentClassName="glass-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this assignment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteAssignment(assignmentIdToDelete)}
          >
            Delete Assignment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default Assignments;
