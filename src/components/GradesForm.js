import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import { Card, Form, Button, ButtonGroup, Row, Col } from "react-bootstrap";

import { toast, ToastContainer } from "react-toastify";

const GradesForm = ({
  handleChildData,
  completedassignments = [{ name: "", weight: "", grade: "" }],
}) => {
  const [assignments, setAssignments] = useState(completedassignments);
  const [validated, setValidated] = useState(false);
  const [Tests, setTests] = useState([{ name: "", weight: "", grade: "" }]);
  const [allTasks, setAllTasks] = useState([]);
  const [GradePrediction, setGradePrediction] = useState(null);

  // Sync state with props when selected course changes
  useEffect(() => {
    setAssignments(completedassignments);
    setTests([{ name: "", weight: "", grade: "" }]); // Reset hypotheticals
    setGradePrediction(null); // Reset prediction
    
    if (completedassignments.length === 0) {
        toast.info("No completed assignments found. Add hypothetical ones to predict.");
    }
  }, [completedassignments]);

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

  const handleTestNameChange = (event, index) => {
    const newTests = [...Tests];
    newTests[index].name = event.target.value;
    setTests(newTests);
  };

  const handleTestWeightChange = (event, index) => {
    const newTests = [...Tests];
    newTests[index].weight = event.target.value;
    setTests(newTests);
  };

  const handleTestGradeChange = (event, index) => {
    const newTests = [...Tests];
    newTests[index].grade = event.target.value;
    setTests(newTests);
  };
  const handleAddRow = () => {
    const newTests = [...Tests, { name: "", weight: "", grade: "" }];
    setTests(newTests);
  };

  const handleDeleteRow = () => {
    const newTests = [...Tests];
    newTests.pop();
    setTests(newTests);
  };

  const checkWeights = () => {
    let totalWeight = 0;
    assignments.forEach((assignment) => {
      if (assignment.weight !== "") {
        totalWeight += parseFloat(assignment.weight);
      }
    });
    Tests.forEach((test) => {
      if (test.weight !== "") {
        totalWeight += parseFloat(test.weight);
      }
    });
    if (totalWeight !== 1) {
      //console.log("Weights do not add up to 1.0");
      toast.error("Weights do not add up to 1.0 Current Total:" + totalWeight);
      setValidated(false);
      return false;
    }
    return true;
  };

  const calculateFinalGrade = (data) => {
    // Calculate the final grade based on weights and grades
    let totalWeight = 0;
    let weightedSum = 0;

    data.forEach((assignment) => {
      if (assignment.weight && assignment.grade) {
        totalWeight += parseFloat(assignment.weight);
        weightedSum += parseFloat(assignment.grade) * parseFloat(assignment.weight);
      }
    });

    // If totalWeight is effectively 1 (checked by checkWeights), this is the result.
    // If not, it's a weighted average. 
    // The previous code verified sum to be 1.0, so weightedSum is the straightforward answer.
    
    //console.log("Final Grade:", weightedSum);
    setGradePrediction(weightedSum);
    //console.log("Final Grade:", GradePrediction);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      toast.error("Please fill out all fields");
      return;
    }
    setValidated(true);
    if (!checkWeights()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    const combinedData = [...assignments, ...Tests];
    setAllTasks(combinedData);
    //console.log("Combined data:", allTasks);

    //handleChildData(allTasks);
    calculateFinalGrade(combinedData);
  };

  return (
    <>
      <ToastContainer />
      {GradePrediction !== null ? (
        <Card className="bg-success bg-opacity-10 border-success border-opacity-50 text-white text-center p-4">
          <Card.Body>
             <h3 className="display-6 fw-bold text-success mb-3">Grade Prediction</h3>
             <div className="display-1 fw-bold mb-0">{Number(GradePrediction).toFixed(2)}%</div>
             <p className="text-muted mt-2">Based on current weights and scores</p>
             <Button variant="outline-success mt-3" onClick={() => setGradePrediction(null)}>Recalculate</Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={12} lg={6}>
                 <h5 className="text-secondary mb-3 border-bottom border-secondary border-opacity-25 pb-2">Completed Assignments</h5>
                {assignments.map((assignment, index) => (
                  <Card
                    key={index}
                    className="bg-dark-glass border border-secondary border-opacity-25 mb-3 text-white"
                  >
                    <Card.Body>
                    <Form.Group controlId={`assign-${index}`} className="mb-3">
                      <Form.Label className="text-muted small text-uppercase">Assignment Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={assignment.name}
                        onChange={(event) => handleNameChange(event, index)}
                        className="bg-transparent text-white border-secondary border-opacity-50"
                        readOnly={true} 
                      />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group controlId={`weight-${index}`}>
                                <Form.Label className="text-muted small text-uppercase">Weight (0-1.0)</Form.Label>
                                <Form.Control
                                    required
                                    type="number" step="0.01"
                                    value={assignment.weight}
                                    onChange={(event) => handleWeightChange(event, index)}
                                    className="bg-transparent text-white border-secondary border-opacity-50"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId={`grade-${index}`}>
                                <Form.Label className="text-muted small text-uppercase">Grade (%)</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    value={assignment.grade}
                                    onChange={(event) => handleGradeChange(event, index)}
                                    className="bg-transparent text-white border-secondary border-opacity-50"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
              
              <Col md={12} lg={6}>
                 <h5 className="text-secondary mb-3 border-bottom border-secondary border-opacity-25 pb-2">Hypothetical Tests/Assignments</h5>
                {Tests.map((test, index) => (
                  <Card
                    key={`test-${index}`}
                    className="bg-dark-glass border border-dashed border-secondary border-opacity-50 mb-3 text-white"
                  >
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-info bg-opacity-20 text-info">Hypothetical</span>
                             {Tests.length > 0 && (
                                <Button variant="link" className="text-danger p-0" title="Remove" onClick={() => {
                                    const newTests = [...Tests];
                                    newTests.splice(index, 1);
                                    setTests(newTests);
                                }}>x</Button>
                             )}
                        </div>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted small text-uppercase">Name</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="e.g. Final Exam"
                          value={test.name}
                          onChange={(event) => handleTestNameChange(event, index)}
                          className="bg-transparent text-white border-secondary border-opacity-50"
                        />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group>
                              <Form.Label className="text-muted small text-uppercase">Weight</Form.Label>
                              <Form.Control
                                required
                                type="number" step="0.01"
                                placeholder="0.2"
                                value={test.weight}
                                onChange={(event) => handleTestWeightChange(event, index)}
                                className="bg-transparent text-white border-secondary border-opacity-50"
                              />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                              <Form.Label className="text-muted small text-uppercase">Est. Grade</Form.Label>
                              <Form.Control
                                required
                                type="number"
                                placeholder="95"
                                value={test.grade}
                                onChange={(event) => handleTestGradeChange(event, index)}
                                className="bg-transparent text-white border-secondary border-opacity-50"
                              />
                            </Form.Group>
                        </Col>
                    </Row>
                    </Card.Body>
                  </Card>
                ))}
                
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-info"
                    onClick={handleAddRow}
                    className="border-dashed"
                  >
                    + Add Hypothetical Assignment
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3 py-2 fw-bold"
                  >
                    Calculate Final Prediction
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
};

export default GradesForm;
