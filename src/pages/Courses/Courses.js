import React ,{ useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import './courses.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { getAuthToken } = useAuth();
  axios.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken()}`;

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
      console.error('Error:', error);
    }
  };
  
  //Format Due Date
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // add leading zero if minutes < 10
    return `${month}/${day}/${year} ${hours}:${minutes}`;
};


  const deleteCourse = async (id) => {
    //Comment out for now to avoid deleting 
   
    // const confirmation = window.confirm('Are you sure you want to delete this grade?');
    // if (confirmation) {
    //     try{
    //         const response = await axios.delete(`http://localhost:5050/assignments/${id}`);
    //         if (response.status === 200) {
    //             //Show lert if succeed
    //             alert('Assignment deleted successfully.');
    //             window.location.href = '/assignments'
    //         } else {
    //             alert('Failed to delete grade.');
    //         }
    //     }catch{
    //             console.error('Error:');
    //             alert('Failed to delete grade.');
    //     }
     }
  return (
    < div className="courses-container">
      <h2>Available Courses</h2>
      <Link to="/addcourse">
      <Button>Add Course</Button>
      </Link>
      <ul>
      {courses.map(course => (
        <li key={course.id}>
            <Link to={`/viewcourse/${course._id}`}><h3>{course.name}</h3>   </Link>
            <p>Professor: {course.professor}</p>
            <p>Schedule: {formatDateToMDYY(course.schedule)}</p>
          
          
            <Button variant ="danger" onClick={()=> deleteCourse(course._id)}>Delete this course</Button>
            {/* <ul>
              {course.assignments.map(assignment => (
                <li key={assignment.id}>
                  {assignment.name}
                </li>
              ))}
            </ul> */}
          
        </li>
      ))}
    </ul> 
    </div>
  );
};

export default Courses;
