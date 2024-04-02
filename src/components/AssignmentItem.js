// components/AssignmentItem.js
import React from "react";
import { Card } from "react-bootstrap";
// import axios from 'axios';

const AssignmentItem = ({ assignment, studentId }) => {
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`;
  };

  return (
    <div>
      <p>Assignment Name: {assignment.name}</p>
      <p>Due Date: {formatDateToMDYY(assignment.dueDate)}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default AssignmentItem;
