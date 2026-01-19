import React, { useState,useEffect } from "react";
import { Modal, Button, Form,ProgressBar } from "react-bootstrap";
import axios from "../../services/mockApi";
import { useAuth } from "../../contexts/AuthContext";
import { calculateStudentLevel } from "../../pages/Assignments/Assignments";
import AssignmentProgressbar from "../../components/AssignmentProgressbar";

//avatar
import AvatarSelection from "../../components/AvatarSelection"
import { avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9 } from "../../components/AvatarSelection";


const ProfileDisplay = ({ show, handleClose, user }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [totalAssignments, setTotalAssignments] = useState([]);
  const { getAuthToken, setUserInfo } = useAuth();
  
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  // Reset state when modal opens
  useEffect(() => {
    if (show && user) {
        setUpdatedUser({ ...user });
        setEditMode(false);
    }
  }, [show, user]);

  const handleInputChange = (event) => {
    setUpdatedUser({ ...updatedUser, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const userId = user._id || user.id;
      const response = await axios.patch(
        `${apiKey}/students/${userId}`,
        updatedUser
      );

      if (response.status === 201) {
        setUserInfo(JSON.stringify(response.data.user));
        setUpdatedUser(response.data.user);
      } else {
        console.log("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
    setEditMode(false); 
  };

   const fetchAssignments = async () => {
    if (!user) return;
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const userId = user._id || user.id;
      const response = await axios.get(
        `${apiKey}/assignments/student/${userId}`
      );
      setTotalAssignments(response.data);
    } catch (error) {
      // console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]); 


  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="glass-modal">
      <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25">
        <Modal.Title style={{ fontFamily: 'var(--font-header)' }}>
          {editMode ? "Edit Profile" : `${updatedUser ? updatedUser.firstName : "User"}'s Profile`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {editMode ? (
          <div className="d-flex flex-column gap-3">
             <div className="text-center mb-2">
                 <AvatarSelection editMode={editMode} />
             </div>

             <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={updatedUser.firstName}
                  onChange={handleInputChange}
                  className="bg-dark-glass text-white border-secondary border-opacity-25"
                />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={updatedUser.lastName}
                  onChange={handleInputChange}
                  className="bg-dark-glass text-white border-secondary border-opacity-25"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleInputChange}
                  className="bg-dark-glass text-white border-secondary border-opacity-25"
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end gap-2">
                 <Button variant="ghost" onClick={() => setEditMode(false)} className="text-muted">Cancel</Button>
                 <Button variant="primary" type="submit">Save Changes</Button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
             <div className="text-center">
                 <AvatarSelection editMode={editMode} />
                 <h4 className="mt-3 mb-1 fw-bold">{updatedUser.firstName} {updatedUser.lastName}</h4>
                 <p className="text-muted small">{updatedUser.email}</p>
             </div>

             <div className="p-3 bg-dark-glass rounded border border-white border-opacity-10">
                 <h6 className="text-uppercase text-muted small mb-3 ls-1">Current Progress</h6>
                 <AssignmentProgressbar assignments ={totalAssignments} />
             </div>
            
             <div className="d-flex justify-content-center">
                <Button variant="outline-primary" onClick={() => setEditMode(true)} className="w-100">
                  Edit Profile
                </Button>
             </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProfileDisplay;
