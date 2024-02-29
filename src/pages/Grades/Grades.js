
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './grades.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

const Grades = () => {
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState({});
    const [assignmentName, setAssignmentName] = useState('');
    const [grade, setGrade] = useState('');
    const [students, setStudents] = useState({});

    useEffect(() => {
        fetch('http://localhost:5050/assignments')
            .then(response => response.json())
            .then(data => {
                setGrades(data);
            })
            .catch(error => console.error('Error:', error));

            fetch('http://localhost:5050/courses')
            .then(response => response.json())
            .then(data => {
                // save courseData as object
                const coursesData = {};
                data.forEach(course => {
                    coursesData[course._id] = course.name;
                });
                setCourses(coursesData);
            })
            .catch(error => console.error('Error:', error));



            fetch('http://localhost:5050/students')
            .then(response => response.json())
            .then(data => {
                // save courseData as object
                const studentsData = {};
                data.forEach(student => {
                    studentsData[student._id] = student.firstName;
                });
                setStudents(studentsData);
            })
            .catch(error => console.error('Error:', error));

    }, []);



    const deleteGrade = (id) => {
        const updatedGrades = grades.filter(grade => grade._id !== id);
        setGrades(updatedGrades);
    };

    return (
        <div className="grades-container">
            <h2>Grade Page </h2> {/**add User name once lgin */}
            <Table>
                <thead>
                    <tr>
                        <th>Assignment Name</th>
                        <th>Grade</th>
                        <th>Weight</th>
                        <th>Course</th>
                        <th>Student Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map(grade => (
                        <tr key={grade._id}>
                            <td>{grade.name}</td> {/**Assignment Name */}
                            <td>{grade.grade}</td>
                            <td>{grade.weight}</td>
                            <td>{courses[grade.course]}</td>
                            <td>{students[grade.student]}</td>
                            <td>
                            <Link to={`/editgrade/${grade._id}`}>Edit</Link> </td>
                            <td>
                            <Button variant="danger" onClick={() => deleteGrade(grade._id)}>Delete</Button>
                            </td>
                              
                        </tr>
                    ))}
                </tbody>
            </Table>

       
        </div>
    );
};

export default Grades;


