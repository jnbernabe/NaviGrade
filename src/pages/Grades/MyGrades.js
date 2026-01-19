// //src/pages/Grades/MyGrades.js
import React, { useState, useEffect } from "react";
import axios from "../../services/mockApi";
import { useAuth } from "../../contexts/AuthContext";
import GradesForm from "../../components/GradesForm";
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";

const MyGrades = () => {
  const { getAuthToken, user, userDetails } = useAuth();
  const [grades, setGrades] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [estimatedGrade, setEstimatedGrade] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [GradePrediction, setGradePrediction] = useState(null);

  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
  const apiKey = process.env.REACT_APP_API_KEY;
  const userInfo = JSON.parse(userDetails);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const response = await axios.get(
          `${apiKey}/courses/student/${userInfo._id}`
        );
        const fetchedCourses = response.data;
        setCourses(fetchedCourses);
        //console.log("Courses:", fetchedCourses);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEstimatedGrade = async (courseId) => {
      try {
        const studentId = userInfo._id;
        const selected = courseId;
        //console.log("Course ID:", selected);
        const response = await axios.get(
          `${apiKey}/grades/estimate-grades/${studentId}/${selected}`
        );

        const completedAssignments = response.data;
        //console.log("Completed Assignments:", completedAssignments);
        setCompletedAssignments(completedAssignments);
        setEstimatedGrade(response.data);
        setError(null);
        setIsLoading(false); // Set loading to false once estimated grade is fetched
      } catch (error) {
        setIsLoading(false);
        setError(
          "Error fetching estimated grade. Message: Do you have any Assignments for this course?"
        );
        console.error("Error fetching estimated grade:", error.message);
      }
    };
    if (selectedCourse) {
      fetchEstimatedGrade(selectedCourse);
    }
  }, [selectedCourse]);

  const handleChildData = (data) => {
    const calculateFinalGrade = () => {
      // Calculate the final grade based on weights and grades
      let totalWeight = 0;
      let weightedSum = 0;

      data.forEach((assignment) => {
        totalWeight += assignment.weight;
        weightedSum += assignment.grade * assignment.weight;
      });

      const finalGrade = weightedSum / totalWeight;
      setGradePrediction(finalGrade);
      //console.log("Final Grade:", GradePrediction);
    };

    calculateFinalGrade();
  };

  return (
    <div className="dashboard-container">
      <div className="glass-panel p-4 mb-4 text-center">
        <h2 className="display-6 fw-bold mb-0">My Grades</h2>
        <p className="text-muted mt-2 mb-0">Track your performance and predict your final score</p>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={12}>
          <div className="glass-panel p-4 mb-4">
            <Form.Label className="text-muted text-uppercase small ls-1">Select Course</Form.Label>
            <Form.Select
              id="course-select"
              className="bg-dark-glass text-white border-secondary border-opacity-25 mb-3"
              onChange={(e) =>
                setSelectedCourse(() => {
                  if (e.target.value !== "") return e.target.value;
                  else return null;
                })
              }
            >
              <option value="" className="text-dark">Select a course to view...</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id} className="text-dark">
                  {course.name}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={() => {
                setGrades([]);
                setCompletedAssignments([]);
                setEstimatedGrade(null);
                setSelectedCourse(null);
                setIsLoading(true);
                setError(null);
                setGradePrediction(null);
                if(document.getElementById("course-select")) document.getElementById("course-select").selectedIndex = 0;
              }}
            >
              Reset Selection
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={12}>
          {isLoading && !selectedCourse ? (
            <div className="text-center text-muted py-5">
               <div style={{fontSize: '3rem', opacity: 0.3}}>🎓</div>
               <p className="mt-3">Select a course above to get started.</p>
            </div>
          ) : isLoading ? (
             <div className="text-center py-5">
                 <div className="spinner-border text-primary mb-3" role="status"></div>
                 <p>Loading course data...</p>
             </div>
          ) : error ? (
            <div className="text-center text-danger glass-panel p-4">{error}</div>
          ) : (
            <>
              {completedAssignments ? (
                <div className="glass-panel p-4">
                  <GradesForm
                    completedassignments={completedAssignments}
                    handleChildData={handleChildData}
                  />
                </div>
              ) : (
                <div className="glass-panel p-5 text-center">
                    <p className="text-muted">No completed assignments found for this course.</p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MyGrades;
