// //src/pages/Grades/MyGrades.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import GradesForm from "../../components/GradesForm";
import { Container, Form } from "react-bootstrap";

const MyGrades = () => {
  const { getAuthToken, user, userDetails } = useAuth();
  const [grades, setGrades] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [estimatedGrade, setEstimatedGrade] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
  const apiKey = process.env.REACT_APP_API_KEY;
  const userInfo = JSON.parse(userDetails);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const response = await axios.get(
          `${apiKey}/courses/student/${userInfo.id}`
        );
        const fetchedCourses = response.data;
        setCourses(fetchedCourses);
        console.log("Courses:", fetchedCourses);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEstimatedGrade = async (courseId) => {
      try {
        const studentId = userInfo.id;
        const selected = courseId;
        //console.log("Course ID:", selected);
        const response = await axios.get(
          `${apiKey}/grades/estimate-grades/${studentId}/${selected}`
        );

        const completedAssignments = response.data;
        console.log("Completed Assignments:", completedAssignments);
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

    fetchEstimatedGrade(selectedCourse);
  }, [selectedCourse]);

  const handleChildData = (data) => {
    // Do something with the child data
    console.log("Child data:", data);
  };

  return (
    <div>
      <h2>My Grades</h2>
      <Container>
        <p>Select your Course</p>
        <Form.Select onChange={(e) => setSelectedCourse(e.target.value)}>
          <option>Open this select menu</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </Form.Select>
      </Container>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Container>
            <div className="completed-assignments">
              {completedAssignments ? (
                completedAssignments.map((assignment) => (
                  <div key={assignment._id}>
                    <p>Assignment Name: {assignment.name}</p>
                    <p>Grade: {assignment.grade}</p>
                    <p>Weight: {assignment.weight}</p>
                  </div>
                ))
              ) : (
                <p>No completed assignments</p>
              )}
            </div>
          </Container>
          <Container>
            <GradesForm handleChildData={handleChildData} />
          </Container>
        </>
      )}
    </div>
  );
};

export default MyGrades;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from "../../contexts/AuthContext";

// const MyGrades = () => {
//     const { getAuthToken, userDetails, setUserDetails } = useAuth();
//     const [grades, setGrades] = useState([]);
//     const [estimatedGrade, setEstimatedGrade] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchGrades = async () => {
//             try {
//                 const token = getAuthToken();
//                 const userId = userDetails && userDetails.id; // Access user ID from userDetails
//                 if (!userId) {
//                     console.error('User ID not found in userDetails');
//                     return;
//                 }
//                 console.log('Fetching grades for user:', userId);
//                 console.log('Authorization token:', token);
//                 const response = await axios.get(`http://localhost:5050/assignments/student/${userId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 console.log('Response data:', response.data);
//                 setGrades(response.data);
//             } catch (error) {
//                 console.error('Error fetching grades:', error);
//                 setError('Error fetching grades. Please try again later.');
//             }
//         };

//         fetchGrades();
//     }, [getAuthToken, userDetails]);

//     useEffect(() => {
//         const fetchEstimatedGrade = async () => {
//             try {
//                 const token = getAuthToken();
//                 const response = await axios.get(`http://localhost:5050/estimate-grades`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setEstimatedGrade(response.data); // Set estimatedGrade to the response data
//                 setIsLoading(false); // Set loading to false once estimated grade is fetched
//             } catch (error) {
//                 setError('Error fetching estimated grade. Please try again later.');
//                 console.error('Error fetching estimated grade:', error);
//             }
//         };

//         fetchEstimatedGrade();
//     }, [getAuthToken]);

//     return (
//         <div>
//             <h2>My Grades</h2>
//             {isLoading ? (
//     <p>Loading...</p>
// ) : (
//     <>
//         {error && (
//             <p>{error && typeof error === 'object' ? JSON.stringify(error) : error}</p>
//         )}
//         {estimatedGrade && Object.keys(estimatedGrade).length === 0 ? (
//             <p>No estimated grade available</p>
//         ) : (
//             <>
//                 {estimatedGrade && estimatedGrade.message && <p>{estimatedGrade.message}</p>}
//                 {estimatedGrade && estimatedGrade.estimatedGrades && <p>Estimated Final Grade: {estimatedGrade.estimatedGrades}</p>}
//             </>
//         )}
//         <ul>
//             {grades.length > 0 ? (
//                 grades.map((grade) => (
//                     <li key={grade._id}>
//                         <p>Assignment Name: {grade.name}</p>
//                         <p>Grade: {grade.grade}</p>
//                         <p>Weight: {grade.weight}</p>
//                     </li>
//                 ))
//             ) : (
//                 <p>No grades available</p>
//             )}
//         </ul>
//     </>
// )}
//         </div>
//     );
// };

// export default MyGrades;
