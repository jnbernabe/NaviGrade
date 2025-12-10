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

  const getPriorityBadge = (p) => {
    // 1=High, 3=Low? Or reverse? Mock data says 1, 2, 3. Let's assume 1 is high.
    // Actually mock data usually implies 1 is highest priority.
    switch(p) {
        case 1: return <span className="badge bg-danger">High Priority</span>;
        case 2: return <span className="badge bg-warning text-dark">Medium</span>;
        case 3: return <span className="badge bg-info text-dark">Low</span>;
        default: return null;
    }
  };

  return (
    <div className="assignment-item-content">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h5 className="mb-0 text-white fw-bold text-break">{assignment.name}</h5>
        {assignment.completed ? (
            <span className="badge bg-success">Done</span>
        ) : (
            assignment.priority > 0 && getPriorityBadge(assignment.priority)
        )}
      </div>
      
      <div className="text-secondary mb-2 small text-uppercase fw-bold ls-1">
         {assignment.course || "No Course"}
      </div>

      <div className="d-flex align-items-center justify-content-between text-light mb-2">
        <div className="d-flex align-items-center">
            <span className="me-2">📅</span>
            <span>Due: {formatDateToMDYY(assignment.dueDate)}</span>
        </div>
        {assignment.completed && assignment.grade !== undefined && (
            <div className="d-flex align-items-center text-primary fw-bold">
                <span className="me-2">🎓</span>
                <span>{assignment.grade}</span>
            </div>
        )}
      </div>

      {assignment.memo && (
        <div className="assignment-memo mt-2 p-2 rounded bg-dark-glass small fst-italic text-muted border border-secondary border-opacity-25">
          📝 "{assignment.memo}"
        </div>
      )}
    </div>
  );
};

export default AssignmentItem;
