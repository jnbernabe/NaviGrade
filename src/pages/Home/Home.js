//Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
  <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to NaviGrade!</h1>
        <p className="lead">NaviGrade is your all-in-one solution for managing courses, assignments, and grades.</p>
        <hr className="my-4" />
        <p>Key Features:</p>
        <ul>
          <li>Track courses and their details.</li>
          <li>Add and manage assignments with due dates.</li>
          <li>Record grades for assignments and tests.</li>
          <li>Get estimates for final grades.</li>
          <li>Set reminders for assignment due dates.</li>
        </ul>
        <p className="lead">
          <strong>Get started now!</strong>
          <br />
          <a className="btn btn-primary btn-lg mt-3" href="/authentication/signup" role="button">Sign Up</a>
          <a className="btn btn-primary btn-lg mt-3" href="/authentication/signin" role="button">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
