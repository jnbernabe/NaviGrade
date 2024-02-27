import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function EditGrade(props) {
    const { id } = useParams(); 
    let navigate = useNavigate();
    const [grade, setGrade] = useState({id:'',assignmentName:'',grade:0});
    const apiUrl ="/editgrade"+id;
    const [assignmentName, setAssignmentName] = useState('');
  

   
    useEffect(() => {
      //It is not working now, waiting for DB to setup
        const fetchData = async()=>{
            const result = await axios(apiUrl)
            setAssignmentName(result.assignmentName);
            setGrade(result.grade);
        };
       
        fetchData();
    }, []); 

    const handleSave = (e) => {
        e.preventDefault();
        const data = { id: grade.id, assignmentName: grade.assignmentName, 
            grade: grade.grade};
          axios.put(apiUrl, data)
            .then((result) => {
              navigate('/grades')
            })
    };

    return (
        <div>
            <h2>Edit Grade</h2>
            <Form onSubmit={handleSave}>
                <Form.Group>
                    <Form.Label>Assignment Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={assignmentName}
                        onChange={(e) => setAssignmentName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Grade</Form.Label>
                    <Form.Control
                        type="number"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
}

export default EditGrade;
