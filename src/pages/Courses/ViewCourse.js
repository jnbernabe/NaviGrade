import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from "../../services/mockApi";
import { Link } from 'react-router-dom';

function ViewCourse() {
    const [course, setCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [editing, setEditing] = useState(false);
    const [editedCourse, setEditedCourse] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/courses');
    };

    const handleEdit = () => {
        setEditing(true);
        setEditedCourse(course);
    };

    const handleChange = (e) => {
        setEditedCourse({ ...editedCourse, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`http://localhost:5050/courses/${id}`, editedCourse);
            if (response.status === 200) {
                setCourse(editedCourse);
                setEditing(false);
                //alert('Course updated successfully');
            } else {
                alert('Failed to update course');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update course');
        }
    };

    useEffect(() => {
        const fetchCourseAndAssignments = async () => {
            try {
                const courseResponse = await axios.get(`http://localhost:5050/courses/${id}`);
                setCourse(courseResponse.data);
                
                const assignmentResponses = await Promise.all(courseResponse.data.assignments.map(async assignmentId => {
                    try {
                        const response = await axios.get(`http://localhost:5050/assignments/${assignmentId}`);
                        return response.data;
                    } catch (error) {
                        return null;
                    }
                }));
    
                const fetchedAssignments = assignmentResponses.filter(assignment => assignment !== null);
                setAssignments(fetchedAssignments);
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchCourseAndAssignments();
    }, [id]);

    const formatDateToMDYY = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0'); // add leading zero if minutes < 10
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    };

    return (
        <div className="courses-container">
            <div className="glass-panel p-5">
            <h2>{editing ? 'Edit Course Details' : 'View Course Details'}</h2>
            {course ? (
                <div>
                    {editing ? (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" value={editedCourse.name} onChange={handleChange} required />
                            <label htmlFor="professor">Professor:</label>
                            <input type="text" id="professor" name="professor" value={editedCourse.professor} onChange={handleChange} required />
                            <label htmlFor="schedule">Schedule:</label>
                            <input type="text" id="schedule" name="schedule" value={editedCourse.schedule} onChange={handleChange} required />
                            <Button variant="primary" type="submit">Save Changes</Button>
                        </form>
                    ) : (
                        <div>
                             <h3>{course.name}</h3>
                             <Button variant="primary" onClick={handleEdit}>Edit Course</Button>
                           
                            <p>Professor: {course.professor}</p>
                            <p>Schedule: {formatDateToMDYY(course.schedule)}</p>
                            <p>Assignments:</p>
                           
                           
                            <ul>
                                {assignments.map(assignment => (
                                    <li key={assignment._id}>{assignment.name}</li>
                                ))}
                            </ul>
                            <Link to={'/addassignment'}><Button >Add Assignment</Button> </Link>
                        </div>
                    )}
                    
                           
                    <Button variant="secondary" onClick={handleBack}>Back to Courses</Button>
                </div>
            ) : (
                <p>Loading course details...</p>
            )}
            </div>
        </div>
    );
}

export default ViewCourse;
