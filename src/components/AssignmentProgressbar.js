import React, { useState, useEffect } from "react";
import "./AssignmentProgressbar.css";
import { calculateStudentLevel } from "../pages/Assignments/Assignments";

const AssignmentProgressbar = ({ assignments = [] }) => {
  const [completedPercentage, setCompletedPercentage] = useState(0);

  useEffect(() => {
    if (assignments.length > 0) {
      const percentage = Math.round(
        (assignments.filter((assignment) => assignment.completed).length /
          assignments.length) *
          100
      );
      // Small delay to allow transition to animate from 0
      setTimeout(() => setCompletedPercentage(percentage), 100);
    } else {
        setCompletedPercentage(0);
    }
  }, [assignments]);

  const studentLevel = calculateStudentLevel(completedPercentage);
  const completedCount = assignments.filter((a) => a.completed).length;
  const totalCount = assignments.length;

  return (
    <div className="d-flex align-items-center w-100 gap-3">
      {/* Level Badge (Mini) */}
      <div className="flex-shrink-0">
         <span className="level-badge m-0" style={{fontSize: '0.75rem', padding: '0.2rem 0.6rem'}}>{studentLevel}</span>
      </div>

      {/* The Bar */}
      <div className="flex-grow-1 position-relative">
        <div className="custom-progress-track" style={{height: '8px', background: 'rgba(255,255,255,0.1)'}}>
            <div 
            className="custom-progress-fill" 
            style={{ width: `${completedPercentage}%` }}
            />
        </div>
      </div>

      {/* Text Stats */}
      <div className="flex-shrink-0 text-end">
         <span className="fw-bold text-white me-2">{completedPercentage}%</span>
         <span className="text-muted small" style={{fontSize: '0.8rem'}}>
            {completedCount} / {totalCount} Done
         </span>
      </div>
    </div>
  );
};

export default AssignmentProgressbar;
