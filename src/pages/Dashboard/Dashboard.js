// Dashboard.js

import React from "react";
import { Button, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { useAuth } from "../../contexts/AuthContext";
import ListGroup from "react-bootstrap/ListGroup";
import "./Dashboard.css";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  const [studentName, setStudentName] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentAssignments, setStudentAssignments] = useState([]);

  const [studentCoursesName, setStudentCoursesName] = useState([]);
  const [studentAssignmentsName, setStudentAssignmentsName] = useState([]);
  const [assignmentDueDates,setAssignmentDueDates] = useState([]);

  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    //fetchAssignments();
    fetchUserInfo();
  }, []);

  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    // const hours = date.getHours();
    // const minutes = date.getMinutes().toString().padStart(2, "0"); // add leading zero if minutes < 10
    return `${month}/${day}/${year} `;
  };

  // const fetchAssignments = async () => {
  //   try {
  //     const apiKey = process.env.REACT_APP_API_KEY;
  //     const response = await axios.get(`${apiKey}/assignments`);
  //     const fetchedAssignments = response.data;

  //     // Fetch course names for each assignment
  //     const updatedAssignments = await Promise.all(
  //       fetchedAssignments.map(async (assignment) => {
  //         const courseResponse = await axios.get(
  //           `${apiKey}/courses/${assignment.course}`
  //         );
  //         const courseName = courseResponse.name;
  //         return { ...assignment, course: courseName };
  //       })
  //     );
  //     setAssignments(updatedAssignments);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };



  // const fetchUserName = async () =>{
  //   try{
  //     const apiKey = process.env.REACT_APP_API_KEY;
  //     const response = await axios.get(`${apiKey}/userinfo`);
  //     const fetchedUserId = response.data.user.userId;
  //     //console.log('fetchedUserId',fetchedUserId)

  //     const studentResponse = await axios.get(`${apiKey}/students/${fetchedUserId}`);
  //     const studentFirstName = studentResponse.data.firstName;
  //     setStudentName(studentFirstName);
     

  //   }catch(error){
  //     console.error("Error:", error);
  //   }
  // }


  const fetchUserInfo = async () =>{
    try{
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`${apiKey}/userinfo`);
      const fetchedUserId = response.data.user.userId;
      //console.log('fetchedUserId',fetchedUserId)

      const studentResponse = await axios.get(`${apiKey}/students/${fetchedUserId}`);
      
      //getting user's firstname
      const studentFirstName = studentResponse.data.firstName;
      setStudentName(studentFirstName);
      

       // Getting user's courses
    let studentCourses = [];
    if (studentResponse.data.courses && Array.isArray(studentResponse.data.courses)) {
      studentCourses = studentResponse.data.courses;
      //console.log('studentCourses',studentCourses);
      setStudentCourses(studentCourses);
    }


    // Getting user's assignments
    let studentAssignments = [];
    if (studentResponse.data.assignments && Array.isArray(studentResponse.data.assignments)) {
      studentAssignments = studentResponse.data.assignments;
      //console.log('studentAssignments',studentAssignments);
      setStudentAssignments(studentAssignments);
    }

    // getting names for courses and assignments
    const fetchCourseNames = async () => {
      const courses = await Promise.all(studentCourses.map(async courseId => {
        try {
          const courseResponse = await axios.get(`${apiKey}/courses/${courseId}`);
          return courseResponse.data.name;
        } catch (error) {
          console.error("Error fetching course:", error);
          return null;
        }
      }));
      return courses.filter(course => course !== null); // filter null
    };

    const fetchAssignmentNames = async () => {
      const assignments = await Promise.all(studentAssignments.map(async assignmentId => {
        try {
          const assignmentResponse = await axios.get(`${apiKey}/assignments/${assignmentId}`);
          return assignmentResponse.data.name;
        } catch (error) {
          console.error("Error fetching assignment:", error);
          return null;
        }
      }));
      return assignments.filter(assignment => assignment !== null); // filter null
    };



    const fetchAssignmentDueDates = async () => {
      const assignments = await Promise.all(studentAssignments.map(async assignmentId => {
        try {
          const assignmentResponse = await axios.get(`${apiKey}/assignments/${assignmentId}`);
          return assignmentResponse.data.dueDate;
        } catch (error) {
          console.error("Error fetching assignment:", error);
          return null;
        }
      }));
      return assignments.filter(assignment => assignment !== null); // filter null
    };

    const courses = await fetchCourseNames();
    setStudentCoursesName(courses);
    const assignments = await fetchAssignmentNames();
    setStudentAssignmentsName(assignments);

    const assignmentsDueDate = await fetchAssignmentDueDates();
    setAssignmentDueDates(assignmentsDueDate)
   


    console.log('Course Names:', courses);
    console.log('Assignment Names:', assignments);
    console.log('assignmentsDueDate',assignmentsDueDate)

    }catch(error){
      console.error("Error:", error);
    }
  }







  return (

    // <div className="dashboard-container mx-auto">
    //   <h2 className="display-5">{studentName}'s Dashboard </h2>
    //   {/*<Button variant="primary">Add Assignment</Button>*/}
    //   {assignments.length === 0 ? (
    //     <p>No assignments currently.</p>
    //   ) : (
    //     <div className="assignment-list">
    //       {assignments.map((assignment) => (
    //         <Card key={assignment._id} className="assignment-card">
    //           <Card.Body>
    //             <Card.Title>{assignment.name}</Card.Title>
    //             <Card.Text>Due Date: {formatDateToMDYY(assignment.dueDate)}</Card.Text>
    //            {/* {studentAssignments[0]} */}

    //           </Card.Body>
    //         </Card>
    //       ))}
    //     </div>
    //   )}
    // </div>

    <div className="dashboard-container mx-auto">
      <h3 className="display-5"> Dashboard for {studentName} </h3>
    
      {studentAssignmentsName.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <div className="assignment-list">
          <p>Assignments</p>
          
          {studentAssignmentsName.map((assignment, index) => (
        <Card key={index} className="assignment-card">
          <Card.Body>
            <Card.Title>{assignment}</Card.Title>
            <Card.Text>Due Date: {formatDateToMDYY(assignmentDueDates)}</Card.Text>
            {/* Add more information necessary */}
          </Card.Body>
        </Card>
      ))}

        </div>
      

      )}




      </div>
  );
};



export default Dashboard;
