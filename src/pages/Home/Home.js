import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="navbar-logo">
          NaviGrade
        </div>
        <div className="navbar-links">
          <Link to="/courses">Courses</Link>
          <Link to="/assignments">Assignments</Link>
        </div>
      </nav>
      <div className="landing-content">
        <h1>Welcome to NaviGrade</h1>
        <p>Your personal academic companion</p>
        <Link to="/courses">
          <button>Explore Courses</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
