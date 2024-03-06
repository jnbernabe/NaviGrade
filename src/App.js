// app.js
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import CalendarContainer from "./pages/Calendar/CalendarContainer";
import Courses from "./pages/Courses/Courses";
import Assignments from "./pages/Assignments/Assignments";
import Navbar from "./components/Navbar";
import AuthenticationPage from "./components/AuthenticationPage";
import Login from "./pages/Login/Login";
import { useAuth } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Grades from "./pages/Grades/Grades";
import EditGrade from "./pages/Grades/EditGrade";
import EditAssignment from "./pages/Assignments/EditAssignment";
import AddAssignment from "./pages/Assignments/AddAssignment";
import ViewCourse from "./pages/Courses/ViewCourse";
import AddCourse from "./pages/Courses/AddCourse";
import Dashboard from "./pages/Dashboard/Dashboard";
import Logout from "./components/Logout";
import "./styles.css";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {user ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/grades" element={<Grades />} />
            <Route
              path="/calendar"
              element={
                <>
                  <CalendarContainer />
                  <div
                    style={{ width: "100%", height: "600px", margin: "50px" }}
                  />
                </>
              }
            />
            <Route path="/editgrade/:id" element={<EditGrade />} />
            <Route path="/editassignment/:id" element={<EditAssignment />} />
            <Route path="/addassignment" element={<AddAssignment />} />
            <Route path="/viewcourse/:id" element={<ViewCourse />} />
            <Route path="/addcourse" element={<AddCourse />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        ) : (
          <Route path="authentication/*" element={<AuthenticationPage />} />
        )}
      </Routes>
    </>
  );
}

export default App;
