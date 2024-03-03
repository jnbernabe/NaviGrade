//Home.js
import React from "react";
import { Container, Button } from "react-bootstrap";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../styles";

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container className="mt-5">
        <div>
          <h1 className="display-4">Welcome to NaviGrade!</h1>
          <p className="lead">
            NaviGrade is your all-in-one solution for managing courses,
            assignments, and grades.
          </p>
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
            <Button variant="light" className="mr-3">
              Sign Up
            </Button>
            <Button variant="light" className="mr-3">
              Log In
            </Button>
          </p>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
