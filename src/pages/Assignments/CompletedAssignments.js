//pages/CompletedAssignments.js
import React, { useState, useEffect } from "react";
import axios from "../../services/mockApi";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import { Card, Button, Form, ButtonGroup } from "react-bootstrap";
import { formatDateToMDYY } from "../../utils/serviceWorkers";
import { ToastContainer, toast } from "react-toastify";
import AssignmentItem from "../../components/AssignmentItem";

const CompletedAssignments = ({ assignments = [], onMarkIncomplete }) => {
  return (
    <div className="completed-list">
      <ToastContainer />
      
      {/* List */}
      <div className="assignments-list">
        {!assignments.length == 0 ? (
          assignments.map((assignment) => (
             <Card
                key={assignment._id}
                className="assignment-card-horizontal assignment-card-completed"
                bsPrefix="card"
              >
              <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center w-100">
                  <div className="flex-grow-1 opacity-75"> {/* Dimmed content for completed */}
                      <AssignmentItem assignment={assignment} />
                  </div>
                  
                  <div className="card-actions-horizontal">
                    <Button 
                        variant="outline-warning" 
                        size="sm"
                        className="rounded-pill px-3 border-opacity-50 text-warning hover-text-white"
                        onClick={() => onMarkIncomplete(assignment._id)}
                        title="Move back to Upcoming"
                    >
                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                        Mark Incomplete
                    </Button>
                  </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="empty-state">
              <h4>No history yet</h4>
              <p>Completed assignments will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedAssignments;
