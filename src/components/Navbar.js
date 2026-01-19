// src/components/Navbar.js

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import ProfileDisplay from "./ProfilePopUp/ProfileDisplay";
import "./Navbar.css";
import logoImage from "../images/back.jpg";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, userDetails } = useAuth(AuthProvider);
  const [showModal, setShowModal] = useState(false);

  let userInfo;
  if (userDetails) {
    try {
      userInfo = JSON.parse(userDetails);
      //console.log("User details:", userInfo);
    } catch (error) {
      console.error("Error parsing userDetails:", error);
    }
  }

  useEffect(() => {
    if (userDetails) {
      try {
        userInfo = JSON.parse(userDetails);
        //console.log("User details:", userInfo);
      } catch (error) {
        console.error("Error parsing userDetails:", error);
      }
    }
  }, [userDetails]);

  const handleOpenModal = (userInfo) => {
    if (userInfo) {
      console.log("User info:", userInfo);
      ProfileDisplay(userInfo);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <BootstrapNavbar
      expand="lg"
      className="mx-auto w-100 sticky-top"
    >
      <div className="navbar-content container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logoImage} alt="NaviGrade" className="logo" />
          NaviGrade
        </Link>

        <BootstrapNavbar.Toggle aria-controls="navbarNav" />

        <BootstrapNavbar.Collapse id="navbarNav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="nav-link">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/courses" className="nav-link">Courses</Nav.Link>
                <Nav.Link as={Link} to="/assignments" className="nav-link">Assignments</Nav.Link>
                <Nav.Link as={Link} to="/calendar" className="nav-link">Calendar</Nav.Link>
                <Nav.Link as={Link} to="/mygrades" className="nav-link">My Grades</Nav.Link>
                
                <div className="nav-separator"></div>

                <div 
                  className="nav-link text-white user-welcome cursor-pointer d-flex align-items-center gap-2" 
                  onClick={() => setShowModal(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="nav-icon">👤</span>
                  {userInfo && userInfo.firstName ? `Hi, ${userInfo.firstName}` : "Profile"}
                </div>

                <Nav.Link as={Link} to="/logout" className="nav-link logout-link">Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/authentication/signup" className="nav-link">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/authentication/signin" className="nav-link highlight-link">Login</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>

        {user && (
          <ProfileDisplay
            show={showModal}
            handleClose={handleCloseModal}
            user={userInfo}
          />
        )}
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
