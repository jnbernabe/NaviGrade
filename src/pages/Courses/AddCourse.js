import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function AddCourse() {
    const [name, setName] = useState('');
    const [professor, setProfessor] = useState('');
    const [schedule, setSchedule] = useState('');
    const [assignment, setAssignment] = useState('');
    const navigate = useNavigate();
    const { getAuthToken } = useAuth();
    axios.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken()}`;
    const apiKey = process.env.REACT_APP_API_KEY;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = {
                name: name,
                professor: professor,
                schedule: schedule,
                assignment:assignment
            };

            const response = await axios.post(`${apiKey}/courses/`, data);
    
            if (response.status === 201) {
                navigate('/courses');
            } else {
                const errorMessage = response.data.message || 'Failed to add course';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add course');
        }
    };

    return (
        <div className="courses-container">
            <h2>Add Course</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Professor</Form.Label>
                    <Form.Control
                        type="text"
                        value={professor}
                        onChange={(e) => setProfessor(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Schedule</Form.Label>
                    <Form.Control
                        type="text"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* <Form.Group>
                    <Form.Label>Assignments</Form.Label>
                    <Form.Control
                        type="text"
                        value={assignment}
                        onChange={(e) => setSchedule(e.target.value)}
                        required
                    />
                </Form.Group> */}

                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
}

export default AddCourse;
