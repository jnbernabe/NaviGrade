import React from 'react';
import {Link} from 'react-router-dom';
import './grades.css'

const Grades = () =>{
    const grades = [
        //for now, should come from DB later with ref with 
        //course ID? /assignmentID? 
        {id:1, assignmentType:'Lab1',grade:90},
        {id:2, assignmentType:'Class Activity1',grade:91},
        {id:3, assignmentType:'Project part1',grade:94}
    ]

//Add, edit, delete buttons to be implemented
return (
    <div>
     <h2>Grade Page</h2>
        {grades.map(grade=>(
            <ul key={grade.id}>
                <p>{grade.assignmentType}</p>
                <p>{grade.grade}</p>
            </ul>
        ))}
  
    </div>
)

};

export default Grades;