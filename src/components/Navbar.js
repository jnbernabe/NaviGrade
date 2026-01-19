// src/components/Navbar.js

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import ProfileDisplay from "./ProfilePopUp/ProfileDisplay";
import "./Navbar.css";
import logoImage from "../images/back.jpg";
import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const { user, userDetails } = useAuth(AuthProvider);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  return (
    <>
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
                    onClick={() => setShowProfileModal(true)}
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
                  <Nav.Link onClick={() => setShowLoginModal(true)} className="nav-link highlight-link" style={{cursor: 'pointer'}}>Login</Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </div>
      </BootstrapNavbar>

      <ProfileDisplay
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
        user={userInfo}
      />
      
      <LoginModal 
        show={showLoginModal} 
        handleClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Navbar;
