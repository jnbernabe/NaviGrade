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
    if (!p) return null;
    const priority = p.toString().toLowerCase(); // handle both numbers or strings safely
    
    // Convert old numbers if they exist in DB (1=High, 2=Medium, 3=Low from mock)
    if (priority === '1' || priority === 'high') return <span className="badge bg-danger">High</span>;
    if (priority === '2' || priority === 'medium') return <span className="badge bg-warning text-dark">Medium</span>;
    if (priority === '3' || priority === 'low') return <span className="badge bg-info text-dark">Low</span>;
    
    return <span className="badge bg-secondary">{p}</span>;
  };

  return (
    <div className="assignment-item-content">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h5 className="mb-0 text-white fw-bold text-break">{assignment.name}</h5>
        {assignment.completed ? (
            <span className="badge bg-success">Done</span>
        ) : (
            assignment.priority && getPriorityBadge(assignment.priority)
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
