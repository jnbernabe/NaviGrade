import React, { useState, Form } from "react";

const GradesForm = ({ handleChildData }) => {
  const [assignments, setAssignments] = useState([
    { name: "", weight: "", grade: "" },
  ]);

  const handleNameChange = (event, index) => {
    const newAssignments = [...assignments];
    newAssignments[index].name = event.target.value;
    setAssignments(newAssignments);
  };

  const handleWeightChange = (event, index) => {
    const newAssignments = [...assignments];
    newAssignments[index].weight = event.target.value;
    setAssignments(newAssignments);
  };

  const handleGradeChange = (event, index) => {
    const newAssignments = [...assignments];
    newAssignments[index].grade = event.target.value;
    setAssignments(newAssignments);
  };

  const handleAddRow = () => {
    const newAssignments = [
      ...assignments,
      { name: "", weight: "", grade: "" },
    ];
    setAssignments(newAssignments);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data, e.g. send it to an API or update state
    console.log("Assignments:", assignments);
  };

  return (
    <form onSubmit={handleSubmit}>
      {assignments.map((assignment, index) => (
        <div key={index}>
          <label>
            Assignment Name:
            <input
              type="text"
              value={assignment.name}
              onChange={(event) => handleNameChange(event, index)}
            />
          </label>
          <br />
          <label>
            Assignment Weight:
            <input
              type="text"
              value={assignment.weight}
              onChange={(event) => handleWeightChange(event, index)}
            />
          </label>
          <br />
          <label>
            Assignment Grade:
            <input
              type="text"
              value={assignment.grade}
              onChange={(event) => handleGradeChange(event, index)}
            />
          </label>
          <br />
        </div>
      ))}
      <button type="button" onClick={handleAddRow}>
        +
      </button>
      <br />
      <button type="button" onClick={handleChildData}>
        Submit
      </button>
      {/* <button type="submit">Submit</button> */}
    </form>
  );
};

export default GradesForm;
