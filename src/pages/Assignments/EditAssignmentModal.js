import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../services/mockApi";
import { useAuth } from "../../contexts/AuthContext";

const EditAssignmentModal = ({ show, onHide, assignment, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: "",
    dueDate: new Date(),
    course: "", // This will be the course ID
    grade: 0,
    weight: 0,
    priority: 0,
    memo: "",
    completed: false
  });
  const [courses, setCourses] = useState([]);
  const { userDetails } = useAuth();
  const userInfo = JSON.parse(userDetails);
  const apikey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (show && assignment) {
      // If assignment has course name instead of ID, we might need to find the ID from the courses list or handle it.
      // The current Assignments.js maps course ID to name. We might need the ID for editing.
      // Let's assume we can fetch courses and match by name if needed, or better yet, pass the original ID if available.
      // Looking at Assignments.js, it seems we replace course ID with Name. This is tricky.
      // We should probably keep the ID in the assignment object or fetch the single assignment again if needed.
      // OR, fix Assignments.js to keep both ID and Name.
      
      setFormData({
        ...assignment,
        dueDate: new Date(assignment.dueDate)
      });
    }
  }, [show, assignment]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${apikey}/courses/student/${userInfo._id}`);
        setCourses(response.data);
         
        // If the assignment course is a Name string, try to find the ID
        if (assignment && typeof assignment.course === 'string') {
             const matchedCourse = response.data.find(c => c.name === assignment.course);
             if (matchedCourse) {
                 setFormData(prev => ({ ...prev, course: matchedCourse._id }));
             }
        }

      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (show) {
      fetchCourses();
    }
  }, [show, userDetails, apikey, assignment, userInfo._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find course name for display update if needed, but API usually expects ID
      const selectedCourse = courses.find(c => c._id === formData.course);
      
      // Update via API
       await axios.patch(`${apikey}/assignments/${assignment._id}`, formData);
       
       // Update local state in parent
       onUpdate({ 
           ...formData, 
           _id: assignment._id,
           course: selectedCourse ? selectedCourse.name : formData.course // Optimistic update for display
       });
       onHide();
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Failed to update assignment");
    }
  };
  
  const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this assignment?")) {
        try {
            await axios.delete(`${apikey}/assignments/${assignment._id}`);
            onDelete(assignment._id);
            onHide();
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
      }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-bottom border-secondary border-opacity-25">
        <Modal.Title style={{ fontFamily: 'var(--font-header)' }}>Edit Assignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Assignment Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-dark-glass text-white border-secondary border-opacity-25"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-block">Due Date</Form.Label>
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              className="form-control bg-dark-glass text-white border-secondary border-opacity-25 w-100"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="bg-dark-glass text-white border-secondary border-opacity-25"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
            
          <div className="row g-3 mb-3">
              <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Grade (0-100)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="bg-dark-glass text-white border-secondary border-opacity-25"
                    />
                  </Form.Group>
              </div>
              <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Priority (1-10)</Form.Label>
                     <Form.Control
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      min="1"
                      max="10"
                      className="bg-dark-glass text-white border-secondary border-opacity-25"
                    />
                  </Form.Group>
              </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Memo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="bg-dark-glass text-white border-secondary border-opacity-25"
            />
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
             <Button variant="outline-danger" onClick={handleDelete}>
                 Delete Assignment
             </Button>
            <div>
                 <Button variant="secondary" onClick={onHide} className="me-2">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditAssignmentModal;
