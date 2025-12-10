//pages/CompletedAssignments.js
import React, { useState, useEffect } from "react";
import axios from "../../services/mockApi";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import { Card, Button, Form, ButtonGroup } from "react-bootstrap";
import { formatDateToMDYY } from "../../utils/serviceWorkers";
import { ToastContainer, toast } from "react-toastify";
import AssignmentItem from "../../components/AssignmentItem";

const CompletedAssignments = ({ assignments = [], onMarkIncomplete }) => {
  //sorting function
  const [sortBy, setSortBy] = useState("dueDate"); // Default sorting by dueDate
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  const handleSortChange = (value) => {
    if (value === sortBy) {
      // If already sorted by this value, toggle sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new value, set new sort value and default sorting order to ascending
      setSortBy(value);
      setSortOrder("asc");
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === "dueDate") {
      // Sort by dueDate
      return sortOrder === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sortBy === "grade") {
      // Sort by priority (from high number to low number)
      return sortOrder === "asc" ? b.grade - a.grade : a.grade - b.grade;
    }
    return 0;
  });

  return (
    <div className="completed-section h-100">
      <ToastContainer />
      <div className="d-flex justify-content-center gap-2 mb-3">
        <Button variant="outline-success text-white" onClick={() => handleSortChange("dueDate")}>
          Date
        </Button>
        <Button variant="outline-info text-white" onClick={() => handleSortChange("grade")}>
          Grade
        </Button>
      </div>
      
      <div className="assignments-grid">
        {!sortedAssignments.length == 0 ? (
          sortedAssignments.map((assignment) => (
             <Card
                key={assignment._id}
                className="assignment-card opacity-75" // Slightly dimmed to indicate completion
                bsPrefix="card"
              >
              <AssignmentItem assignment={assignment} />
              
              <ButtonGroup className="mt-3 w-100 bg-dark-glass rounded-pill overflow-hidden border border-white border-opacity-10">
                  <Button 
                    variant="link" 
                    className="text-warning text-decoration-none w-100"
                    onClick={() => onMarkIncomplete(assignment._id)}
                  >
                      Mark Incomplete
                  </Button>
              </ButtonGroup>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted py-5 border border-dashed border-secondary rounded-3">
              No completed assignments found
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedAssignments;
