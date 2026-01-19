// Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "../../services/mockApi";
import { Card, Button } from "react-bootstrap";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import "./Dashboard.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentItem from "../../components/AssignmentItem";
import AssignmentProgressbar from "../../components/AssignmentProgressbar";
import Calendar from "../Calendar/Calendar";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);  //assignments are sorted by completed
  const [courses, setCourses] = useState([]);
  // const [totalAssignments, setTotalAssignments] = useState([]); //totalAssignments are total assignment without sorting 
  const [totalAssignments, setTotalAssignments] = useState([]);
 
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);
  const userInfo = JSON.parse(userDetails);
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchAssignments();
  }, []);

 // console.log('userinfo',userInfo.email);

  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year} `;
  };

  const fetchAssignments = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/assignments/student/${userInfo._id}`
      );
      const fetchedAssignments = response.data;
      setTotalAssignments(fetchedAssignments);
      const updatedAssignments = await Promise.all(
        fetchedAssignments
          .filter((assignment) => !assignment.completed)
          .map(async (assignment) => {
            const courseResponse = await axios.get(
              `${apiKey}/courses/${assignment.course}`
            );
            const courseName = courseResponse.name;
            return { ...assignment, course: courseName };
          })
      );
      const sortedAssignments = [...updatedAssignments].sort((a, b) => {
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      setAssignments(sortedAssignments);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const notifyClosestAssignment = () => {
    if (assignments.length === 0) {
      toast("No assignments currently.");
      return;
    }
  
    // Sort assignments by dueDate in ascending order
    const sortedAssignments = [...assignments].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  
    // Get the closest assignment (first one in the sorted list)
    const closestAssignment = sortedAssignments[0];
  
    const today = new Date();
    const dueDate = new Date(closestAssignment.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Display a toast with information about the closest assignment
    toast(`Closest assignment: ${closestAssignment.name}  
    ${diffDays} day(s) left`);
  };

  const notifyEmailSentMessage = () =>{
    toast("Email sent");
  }
//email notification 
const handleSendEmail = async () => {
 
  try {
    const sortedAssignments = [...assignments].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    if(sortedAssignments.length == 0){
      toast("You do not have any assignment");
    }
    const closestAssignment = sortedAssignments[0];
    const today = new Date();
    const dueDate = new Date(closestAssignment.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const userEmail = userInfo.email;
    const apiKey = process.env.REACT_APP_API_KEY;
    const response = await axios.post( `${apiKey}/email/sendEmail`,{
    closestAssignment: closestAssignment,
    diffDays: diffDays,
    userEmail: userEmail
    });
    console.log('dueDate' ,dueDate)
    console.log("Email sent")
    // pop up message
    notifyEmailSentMessage();
  } catch (error) {
    console.error("Error sending email:", error);
   
  }
};

const fetchCourses = async () => {
  try {
    const apiKey = process.env.REACT_APP_API_KEY;
    const response = await axios.get(
      `${apiKey}/courses/student/${userInfo._id}`
    );
    const fetchedCourses = response.data;
    setCourses(fetchedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="dashboard-container mx-auto">
    
     
    <div id="cssportal-grid">
      <div id="div1">
        {/* Left: Compact Greeting */}
        <div className="d-flex align-items-center gap-2 pe-4 border-end border-secondary border-opacity-25" style={{ minWidth: '220px' }}>
             <div className="rounded-circle bg-primary bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height:'40px'}}>
                 <span style={{fontSize: '1.2rem'}}>👋</span>
             </div>
             <div>
                 <div className="text-muted small text-uppercase" style={{fontSize: '0.65rem', letterSpacing: '1px'}}>{getGreeting()}</div>
                 <div className="fw-bold text-white lh-1">{userInfo.firstName}</div>
             </div>
        </div>

        {/* Middle: Progress Bar (Takes remaining space) */}
        <div className="flex-grow-1 px-4">
          <AssignmentProgressbar assignments={totalAssignments} />
        </div>

        {/* Right: Actions */}
        <div className="d-flex gap-2 ps-4 border-start border-secondary border-opacity-25">
             <Button size="sm" variant="outline-light" className="border-opacity-25 text-muted hover-white" onClick={notifyClosestAssignment} style={{fontSize: '0.8rem'}}>
                Next Due
              </Button>
              <ToastContainer theme="dark" />
              <Button size="sm" variant="primary" onClick={handleSendEmail} style={{fontSize: '0.8rem', padding: '0.25rem 0.75rem'}}>
                Reminder
              </Button>
        </div>
      </div>
      <div id="div2" className="glass-panel">
        {/* left column */}
              
      <h4>Assignment(s)</h4>
      {assignments.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="assignment-card"
              bsPrefix="card"
            >
              <AssignmentItem
                assignment={assignment}
                studentId={userInfo._id}
              />
            </Card>
          ))}
        </div>
      )}
      </div>
      <div id="div3" className="text-center"> 
       <h4>Assignment Calendar</h4>
      
       <Calendar courses={courses} assignments={totalAssignments} height="600px" />
      </div>
  </div>

      {/* 
      <AssignmentProgressbar
      assignments={ totalAssignments}
      />
      <Button variant="warning" onClick={notifyClosestAssignment}>
        What should I do!?
      </Button>
      <ToastContainer />
      <button onClick={handleSendEmail}>Send Email</button>
      <h4>Assignment(s)</h4>
      {assignments.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="assignment-card"
              style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
              bsPrefix
            >
              <AssignmentItem
                assignment={assignment}
                studentId={userInfo._id}
              />
            </Card>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
