//src/pages/Grades/EditGrade.js
import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "../../services/mockApi";

function EditGrade(props) {
    const { id } = useParams(); 
    let navigate = useNavigate();
    const [grade, setGrade] = useState({ id: '', name: '', grade: 0, weight: 0 });
    const [assignmentName, setAssignmentName] = useState('');
    const apiUrl = `http://localhost:5050/assignments/${id}`;
  

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(apiUrl);
                const { name, grade, weight } = result.data;
                setAssignmentName(name);
                setGrade({ id, name, grade, weight });
            } catch (error) {
                console.error('Error:', error);
            }
        };
       
        fetchData();
    }, [apiUrl, id]); 

    const handleSave = (e) => {
        e.preventDefault();
        const data = { name: grade.name, grade: grade.grade, weight: grade.weight };
        axios.patch(apiUrl, data)
            .then((result) => {
                navigate('/grades');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="grades-container">
            <div className="glass-panel p-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Edit Grade</h2>
            <Form onSubmit={handleSave}>
                <p className="text-muted mb-4">Assignment: <span className="text-info">{assignmentName}</span></p>
                <Form.Group className="mb-3">
                    <Form.Label>Grade</Form.Label>
                    <Form.Control
                        type="number"
                        value={grade.grade}
                        onChange={(e) => setGrade({ ...grade, grade: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control
                        type="number"
                        value={grade.weight}
                        onChange={(e) => setGrade({ ...grade, weight: e.target.value })}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Save Changes
                </Button>
            </Form>
            </div>
        </div>
    );
}

export default EditGrade;