import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./courses.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "../../services/mockApi";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";

const Courses = () => {
  const [courses, setCourses] = useState([]);
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

  //Format Due Date
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // add leading zero if minutes < 10
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const deleteCourse = async (id) => {
    //******************Only admin should be able to delete course?************
    //Otherwise, gives a conflict and make no sense when displaying assignments when course is not available
    // const confirmation = window.confirm('Are you sure you want to delete this grade?');
    // if (confirmation) {
    // try{
    //     const response = await axios.delete(`http://localhost:5050/courses/${id}`);
    //     if (response.status === 200) {
    //         //Show lert if succeed
    //         alert('Assignment deleted successfully.');
    //         window.location.href = '/courses'
    //     } else {
    //         alert('Failed to delete grade.');
    //     }
    // }catch{
    //         console.error('Error:');
    //         alert('Failed to delete grade.');
    // }
  };

  return (
    <div className="courses-container">
      <h2 className="display-5">My Courses</h2>
      <Link to="/addcourse">
        <Button variant="primary">Add Course</Button>
      </Link>
      <div className="course-list">
        {courses.map((course) => (
          <Card
            key={course._id}
            className="course-card"
            bsPrefix="card"
          >
            <Card.Body>
              <Card.Title>{course.name}</Card.Title>
              <div className="card-subtitle">Professor: {course.professor}</div>

              <div className="course-info-grid">
                <div className="course-info-item">
                  <span className="course-info-label">Day</span>
                  <span className="course-info-value">
                    {course.schedules[0] ? course.schedules[0].day : "TBD"}
                  </span>
                </div>
                <div className="course-info-item">
                  <span className="course-info-label">Time</span>
                  <span className="course-info-value">
                    {course.schedules[0]
                      ? `${course.schedules[0].startTime} - ${course.schedules[0].endTime}`
                      : "TBD"}
                  </span>
                </div>
              </div>

              {course.memo && <div className="course-memo">"{course.memo}"</div>}

              <div className="course-actions">
                <Link to={`/editcourse/${course._id}`}>Edit Course</Link>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Courses;
