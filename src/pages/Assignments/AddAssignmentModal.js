import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../services/mockApi";
import { useAuth } from "../../contexts/AuthContext";

const AddAssignmentModal = ({ show, onHide, onAdd }) => {
  const initialFormState = {
    name: "",
    dueDate: new Date(),
    course: "", // Course ID
    grade: 0,
    weight: 0,
    priority: "Medium",
    memo: "",
    completed: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [courses, setCourses] = useState([]);
  const { userDetails } = useAuth();
  const userInfo = JSON.parse(userDetails);
  const apikey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${apikey}/courses/student/${userInfo._id}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (show) {
      fetchCourses();
      setFormData(initialFormState); // Reset form when opening
    }
  }, [show, userDetails, apikey, userInfo._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCourse = courses.find(c => c._id === formData.course);
      
      const payload = {
        ...formData,
        studentId: userInfo._id
      };
      
      const response = await axios.post(`${apikey}/assignments/add-assignment`, payload);
      
      // Pass back the new assignment for local update (optimistic or from response)
      onAdd({
          ...response.data,
          course: selectedCourse ? selectedCourse.name : "Unknown Course" 
      });
      
      onHide();
    } catch (error) {
      console.error("Error adding assignment:", error);
      alert("Failed to add assignment");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="glass-modal">
      <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25">
        <Modal.Title style={{ fontFamily: 'var(--font-header)' }}>Add New Assignment</Modal.Title>
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
              placeholder="e.g. Final Project"
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
              required
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
                    <Form.Label>Priority</Form.Label>
                     <Form.Select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="bg-dark-glass text-white border-secondary border-opacity-25"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Form.Select>
                  </Form.Group>
              </div>
              <div className="col-md-6">
                 {/* Weight input could go here if needed, or left out for simplicity */}
              </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Memo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="Details about the assignment..."
              className="bg-dark-glass text-white border-secondary border-opacity-25"
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
             <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Task
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAssignmentModal;
