import React,{ useState }  from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './grades.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

const Grades = () =>{
    const [grades, setGrades] = useState([
        {id:1, assignmentName:'Lab 1',grade:90},
        {id:2, assignmentName:'Assignment 1',grade:90},
    ]);

    let navigate = useNavigate();
    const [assignmentName, setAssignmentName] = useState('');
    const [grade, setGrade] = useState('');

    const saveGrade = (e)=>{
        e.preventDefault();

    //Add Grade in DB after DB is setup
    //addGrade({})

        // Making newGrade object
        const newGrade = {
            id: grades.length + 1, // assign new ID
            assignmentName: assignmentName,
            grade: grade
        };
        // newGrades are added
        setGrades([...grades, newGrade]);
        
        // clearing form
        setAssignmentName('');
        setGrade('');
        
        // refreshing page. 
        //navigate('/grades');
    }

    const deleteGrade = (id) => {
        const updatedGrades = grades.filter((grade) => grade.id !== id);
        setGrades(updatedGrades);
    };

    const editGrade =(id)=>{

    }
    

    return (
        <div className="grades-container">
            <h2>Grade Page</h2>
            <Table >
                <tbody>
                    <tr>
                        <th>Assignment Name</th> 
                        <th>Grade</th>
                        <th>Actions</th>
                    </tr>
                   
                    {grades.map(grade => (
                    <tr key={grade.id}>
                     
                        <td>{grade.assignmentName}</td>
                        <td>Grade: {grade.grade}</td>
                          <td>
                          <Link to={`/editgrade/${grade.id}`}>Edit</Link>
                          </td>
                          <td>
                          <Button variant="danger" onClick={() => deleteGrade(grade.id)}>Delete</Button>
                          </td>
                    </tr>
                    ))}
               
                </tbody>
        
            </Table>
                        <h2>Add New Grade</h2>
            <Form onSubmit={saveGrade}>
                <Form.Group>
                    <Form.Label> Assignment Name</Form.Label>
                    <Form.Control type="text" name="assignmentName" id="assignmentName" placeholder="Enter assignmentName" 
                    value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label> Grade</Form.Label>
                    <Form.Control type="number" name="grade" id="grade" placeholder="Enter grade" 
                    value={grade} onChange={(e) => setGrade(e.target.value)} />
                </Form.Group>
                                            
                <Button variant="primary" type="submit">
                    Save Grade
                </Button>
            </Form>
        </div>
    );
};

export default Grades;
