// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "./LogoutButton";
import "./Navbar.css";
import logoImage from "../images/back.jpg";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="navbar-brand-container">
          {/* Navbar brand logo */}
          <img src={logoImage} alt="Logo" className="logo" />
          {/* Navbar brand text */}
          <Link to="/" className="navbar-brand">
            NaviGrade
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/courses" className="nav-link">
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/assignments" className="nav-link">
                    Assignments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/calendar" className="nav-link">
                    Calendar
                  </Link>
                </li>
                <li className="nav-item">
                  <LogoutButton className="nav-item" />
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/authentication/signup" className="nav-link">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/authentication/signin" className="nav-link">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;