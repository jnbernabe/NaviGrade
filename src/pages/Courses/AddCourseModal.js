import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "../../services/mockApi";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

const COLORS = [
  { name: "Violet", value: "#8b5cf6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Yellow", value: "#eab308" },
];

const AddCourseModal = ({ show, onHide, onAdd }) => {
  const { getAuthToken, userDetails } = useAuth(AuthProvider);
  const userInfo = JSON.parse(userDetails);
  const apiKey = process.env.REACT_APP_API_KEY;

  const [formData, setFormData] = useState({
    name: "",
    professor: "",
    schedule: { day: "", startTime: "", endTime: "" },
    startDate: new Date(),
    endDate: new Date(),
    memo: "",
    color: "#8b5cf6", // Default violet
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        professor: formData.professor,
        schedule: [formData.schedule], // Backend expects array
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        color: formData.color,
        memo: formData.memo,
        assignments: [],
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
      const response = await axios.post(`${apiKey}/courses/`, payload);

      if (response.status === 201) {
        // Link to student
        const courseId = response.data.courseId;
        await axios.post(`${apiKey}/courses/${userInfo._id}/add-course`, { courseId });

        // Build the new course object to return immediately
        const newCourse = { ...payload, _id: courseId };
        onAdd(newCourse);
        
        // Reset form
        setFormData({
            name: "",
            professor: "",
            schedule: { day: "", startTime: "", endTime: "" },
            startDate: new Date(),
            endDate: new Date(),
            memo: "",
            color: "#8b5cf6",
        });
        
        onHide();
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="glass-modal">
      <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25">
        <Modal.Title style={{ fontFamily: 'var(--font-header)' }}>Add New Course</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3 mb-3">
             <Col md={8}>
                <Form.Group>
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="e.g. Advanced Algorithms"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        className="bg-dark-glass text-white border-secondary border-opacity-25"
                    />
                </Form.Group>
             </Col>
             <Col md={4}>
                <Form.Group>
                    <Form.Label>Color Code</Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                        {COLORS.map((c) => (
                             <div 
                                key={c.value}
                                title={c.name}
                                onClick={() => handleChange("color", c.value)}
                                style={{
                                    backgroundColor: c.value,
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: formData.color === c.value ? '2px solid white' : 'none',
                                    boxShadow: formData.color === c.value ? '0 0 8px ' + c.value : 'none'
                                }}
                             />
                        ))}
                    </div>
                </Form.Group>
             </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Professor</Form.Label>
            <Form.Control
                type="text"
                placeholder="Dr. Smith"
                value={formData.professor}
                onChange={(e) => handleChange("professor", e.target.value)}
                className="bg-dark-glass text-white border-secondary border-opacity-25"
            />
          </Form.Group>

          <Row className="g-3 mb-3">
             <Col md={12}>
                <Form.Group>
                    <Form.Label>Days</Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div
                                key={day} 
                                onClick={() => {
                                    const currentDays = formData.schedule.day ? formData.schedule.day.split(', ') : [];
                                    let newDays;
                                    if (currentDays.includes(day)) {
                                        newDays = currentDays.filter(d => d !== day);
                                    } else {
                                        newDays = [...currentDays, day];
                                        // Sort days based on standard week order
                                        const weekOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                                        newDays.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
                                    }
                                    handleScheduleChange("day", newDays.join(', '));
                                }}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '50px',
                                    background: formData.schedule.day && formData.schedule.day.includes(day) ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    color: formData.schedule.day && formData.schedule.day.includes(day) ? 'white' : 'var(--text-muted)',
                                    border: '1px solid var(--glass-border)',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </Form.Group>
             </Col>
          </Row>
          <Row className="g-3 mb-3">
             <Col md={6}>
                <Form.Group>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                        type="time"
                        value={formData.schedule.startTime}
                        onChange={(e) => handleScheduleChange("startTime", e.target.value)}
                        className="bg-dark-glass text-white border-secondary border-opacity-25"
                    />
                </Form.Group>
             </Col>
             <Col md={6}>
                <Form.Group>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                        type="time"
                        value={formData.schedule.endTime}
                        onChange={(e) => handleScheduleChange("endTime", e.target.value)}
                        className="bg-dark-glass text-white border-secondary border-opacity-25"
                    />
                </Form.Group>
             </Col>
          </Row>
          
          <Row className="g-3 mb-3">
             <Col md={6}>
                 <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <div className="custom-datepicker-wrapper">
                        <DatePicker
                            selected={formData.startDate}
                            onChange={(date) => handleChange("startDate", date)}
                            className="form-control bg-dark-glass text-white border-secondary border-opacity-25 w-100"
                        />
                    </div>
                 </Form.Group>
             </Col>
             <Col md={6}>
                 <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <div className="custom-datepicker-wrapper">
                        <DatePicker
                            selected={formData.endDate}
                            onChange={(date) => handleChange("endDate", date)}
                            className="form-control bg-dark-glass text-white border-secondary border-opacity-25 w-100"
                        />
                    </div>
                 </Form.Group>
             </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Memo</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                placeholder="Course description or notes..."
                value={formData.memo}
                onChange={(e) => handleChange("memo", e.target.value)}
                className="bg-dark-glass text-white border-secondary border-opacity-25"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="ghost" onClick={onHide} className="text-muted">Cancel</Button>
            <Button variant="primary" type="submit" className="px-4">Add Course</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCourseModal;
