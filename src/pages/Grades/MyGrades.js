// //src/pages/Grades/MyGrades.js
import React, { useState, useEffect } from "react";
import axios from "../../services/mockApi";
import { useAuth } from "../../contexts/AuthContext";
import GradesForm from "../../components/GradesForm";
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import GradesFormEdit from "./GradesFormEdit";
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
    <div className="grades-container">
      <div>
        <h2>My Grades</h2>

        <div className="grade-card glass-panel" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <p className="mb-2">Select your Course to view grades</p>
          <Form.Select
            id="course-select"
            className="mb-3"
            onChange={(e) =>
              setSelectedCourse(() => {
                if (e.target.value !== "") return e.target.value;
                else return null;
              })
            }
          >
            <option value="">Select a course...</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
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
              document.getElementById("course-select").selectedIndex = 0;
            }}
          >
            Reset Selection
          </Button>
        </div>
      </div>
      <>
        {isLoading && !selectedCourse ? (
          <p className="text-center text-muted">Please select a course above.</p>
        ) : isLoading ? (
             <p className="text-center">Loading grades...</p>
        ) : error ? (
          <div className="text-center text-danger glass-panel p-3">{error}</div>
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
              <p className="text-center">No completed assignments found.</p>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default MyGrades;
