import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const ProfileDisplay = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const { getAuthToken, setUserInfo } = useAuth();
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
  const handleClose = () => {
    setShowModal(false);
    setEditMode(false); // Reset edit mode when closing the modal
  };
  const handleShow = () => setShowModal(true);

  const handleInputChange = (event) => {
    setUpdatedUser({ ...updatedUser, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      console.log("Updated user data:", updatedUser);
      const response = await axios.patch(
        `${apiKey}/students/${user.id}`,
        updatedUser
      );

      if (response.status === 201) {
        // Handle successful update
        console.log("Response:", response.data.user);
        setUserInfo(JSON.stringify(response.data.user));
        setUpdatedUser(response.data.user);

        //localStorage.setItem("user", JSON.stringify(updatedUser));
        //console.log("User data updated successfully: ", updatedUser);
      } else {
        // Handle update error
        console.log("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
    setEditMode(false); // Switch back to view mode after submitting the form
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        View Profile
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {updatedUser && updatedUser.firstName
              ? `${updatedUser.firstName}'s Profile`
              : "User Profile"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={updatedUser.firstName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {/* Add more fields as needed */}
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          ) : (
            <>
              <p>
                Name:{" "}
                {updatedUser && updatedUser.firstName
                  ? updatedUser.firstName
                  : "N/A"}
              </p>
              <p>
                Email:{" "}
                {updatedUser && updatedUser.email ? updatedUser.email : "N/A"}
              </p>
              {/* Add more profile information as needed */}
              <Button variant="primary" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileDisplay;
