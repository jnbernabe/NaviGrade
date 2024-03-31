// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { useEffect } from "react";

import "./Navbar.css";
import logoImage from "../images/back.jpg";

const Navbar = () => {
  const { user, userDetails } = useAuth(AuthProvider);

  return (
    <BootstrapNavbar
      expand="lg"
      bg="dark"
      variant="dark"
      className="mx-auto w-100 "
    >
      <Container fluid>
        <Link to="/" className="navbar-brand">
          {/* Navbar brand logo */}
          <img src={logoImage} alt="Logo" className="logo" />
          {/* Navbar brand text */}
          NaviGrade
        </Link>

        <BootstrapNavbar.Toggle aria-controls="navbarNav" />

        <BootstrapNavbar.Collapse id="navbarNav">
          <Nav className="ml-auto w-100" bsPrefix>
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className="nav-link"
                  bsPrefix
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/courses" className="nav-link">
                  Courses
                </Nav.Link>
                <Nav.Link as={Link} to="/assignments" className="nav-link">
                  Assignments
                </Nav.Link>
                <Nav.Link as={Link} to="/calendar" className="nav-link">
                  Calendar
                </Nav.Link>
                <Nav.Link as={Link} to="/mygrades" className="nav-link">
                  My Grades
                </Nav.Link>

                <Nav.Link as={Link} to="/logout" className="nav-link">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/authentication/signup"
                  className="nav-link"
                >
                  Sign Up
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/authentication/signin"
                  className="nav-link"
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
        <BootstrapNavbar.Text className="text-white">
          {userDetails ? `Welcome, ${JSON.parse(userDetails).Fname}` : " "}
        </BootstrapNavbar.Text>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
