import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom"; // Link no longer needed for add/edit
import "./courses.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "../../services/mockApi";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import AddCourseModal from "./AddCourseModal";
import EditCourseModal from "./EditCourseModal";
import { ToastContainer } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);

  const userInfo = JSON.parse(userDetails);
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/courses/student/${userInfo._id}`
      );
      const fetchedCourses = response.data;
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCourseAdd = (newCourse) => {
      setCourses(prev => [...prev, newCourse]);
  };

  const handleCourseUpdate = (updatedCourse) => {
      setCourses(prev => prev.map(c => c._id === updatedCourse._id ? updatedCourse : c));
  };

  const handleCourseDelete = (courseId) => {
      setCourses(prev => prev.filter(c => c._id !== courseId));
  };

  const openEditModal = (course) => {
      setEditingCourse(course);
      setShowEditModal(true);
  };

  return (
    <div className="courses-container">
      <ToastContainer />
      <h1 className="page-header">My Courses</h1>
      
      <div className="action-bar">
          <Button variant="primary" className="add-course-btn" onClick={() => setShowAddModal(true)}>
            + Add New Course
          </Button>
      </div>

      <div className="course-list">
        {courses.length === 0 ? (
          <div className="empty-courses">
            <h3>No courses found.</h3>
            <p>Add a course to get started tracking your grades!</p>
          </div>
        ) : (
          courses.map((course) => (
            <Card
              key={course._id}
              className="course-card"
              bsPrefix="card"
              style={course.color ? { borderLeft: `4px solid ${course.color}` } : {}}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title>{course.name}</Card.Title>
                        <div className="card-subtitle">
                        {course.professor ? `Prof. ${course.professor}` : "No Professor Listed"}
                        </div>
                    </div>
                    {course.color && (
                        <div style={{
                            width: '12px', height: '12px', borderRadius: '50%', backgroundColor: course.color,
                            boxShadow: `0 0 10px ${course.color}`
                        }} title="Course Color"></div>
                    )}
                </div>

                <div className="course-info-grid">
                  <div className="course-info-item">
                    <span className="course-info-label">Schedule</span>
                    <span className="course-info-value">
                      {course.schedules && course.schedules[0] ? course.schedules[0].day : "Online/TBD"}
                    </span>
                  </div>
                  <div className="course-info-item">
                    <span className="course-info-label">Time</span>
                    <span className="course-info-value">
                      {course.schedules && course.schedules[0]
                        ? `${course.schedules[0].startTime} - ${course.schedules[0].endTime}`
                        : "--:--"}
                    </span>
                  </div>
                </div>

                {course.memo && <div className="course-memo">"{course.memo}"</div>}

                <div className="course-actions">
                  <Button variant="link" className="text-decoration-none p-0" onClick={() => openEditModal(course)}>Edit Course</Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      <AddCourseModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onAdd={handleCourseAdd}
      />

      <EditCourseModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        course={editingCourse}
        onUpdate={handleCourseUpdate}
        onDelete={handleCourseDelete}
      />
    </div>
  );
};
export default Courses;
