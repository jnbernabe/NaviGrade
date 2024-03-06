import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import axios from 'axios';

const CalendarContainer = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`${apiKey}/courses`);
      const fetchedCourses = response.data;
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div>
      <h1>Course Calendar</h1>
      <Calendar courses={courses} />
    </div>
  );
};

export default CalendarContainer;
