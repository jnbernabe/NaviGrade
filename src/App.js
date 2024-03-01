// Example in App.js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';  // Check the path and capitalization here
import Courses from './pages/Courses/Courses';
import Assignments from './pages/Assignments/Assignments';
import Grades from './pages/Grades/Grades'
import EditGrade from './pages/Grades/EditGrade'
import EditAssignment from './pages/Assignments/EditAssignment';
import AddAssignment from './pages/Assignments/AddAssignment'

function App() {
  return (
    <>
    <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/courses">Courses</Link></li>
      <li><Link to="/assignments">Assignments</Link></li>
      <li><Link to="/grades">Grades</Link></li>
    </ul>
      
    </nav>
    <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/grades" element={<Grades />} />
        <Route path ="/editgrade/:id" element={<EditGrade/>}/>
        <Route path ="/editassignment/:id" element={<EditAssignment/>}/>
        <Route path ="/addassignment" element={<AddAssignment/>}/>
    </Routes>
     </>
  );
}

export default App;
