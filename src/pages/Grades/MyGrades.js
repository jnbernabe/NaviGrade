import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";

const MyGrades = () => {
    const { getAuthToken, userDetails } = useAuth(); // Destructure userDetails from useAuth
    const [grades, setGrades] = useState([]);
    const [estimatedGrade, setEstimatedGrade] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const token = getAuthToken();
                const response = await axios.get('http://localhost:5050/assignments', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setGrades(response.data);
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, [getAuthToken]);

    useEffect(() => {
        const fetchEstimatedGrade = async () => {
            try {
                const token = getAuthToken();
                const userId = userDetails; // Use userDetails directly to get the user's ID
                const response = await axios.get(`http://localhost:5050/estimate-grade/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEstimatedGrade(response.data.estimatedGrade);
            } catch (error) {
                console.error('Error fetching estimated grade:', error);
            }
        };
    
        fetchEstimatedGrade();
    }, [getAuthToken, userDetails]); // Add userDetails to the dependency array

    return (
        <div>
            <h2>My Grades</h2>
            <p>Estimated Final Grade: {estimatedGrade}</p>
            <ul>
                {grades.map((grade) => (
                    <li key={grade._id}>
                        <p>Assignment Name: {grade.name}</p>
                        <p>Grade: {grade.grade}</p>
                        <p>Weight: {grade.weight}</p>
                        {/* Add more details if needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyGrades;
