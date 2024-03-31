// components/AssignmentItem.js
import React from 'react';
// import axios from 'axios';

const AssignmentItem = ({ assignment, studentId }) => {
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`;
  };

//   const markAsCompleted = async () => {
//     try {
//       await axios.post(`http://localhost:5050/completed-assignments/${assignment._id}/mark-completed/${studentId}`);
//       alert('Assignment marked as completed successfully');
//     } catch (error) {
//       console.error('Error marking assignment as completed:', error);
//       alert('Failed to mark assignment as completed');
//     }
//   };

  return (
    <div>
      <p>Assignment Name: {assignment.name}</p>
      <p>Due Date: {formatDateToMDYY(assignment.dueDate)}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default AssignmentItem;
