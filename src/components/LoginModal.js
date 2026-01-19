import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ show, handleClose, isDemo = false }) => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && isDemo) {
        setEmail("alex@example.com");
        setPassword("password123");
    } else if (show) {
        // Reset if not forced demo, or keep previous input? 
        // Better to clear if opening fresh unless we want persistence
        if(!isDemo) {
            setEmail("");
            setPassword("");
        }
    }
  }, [show, isDemo]);

  const handleLogin = async (e) => {
    if(e) e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const success = await signin(email, password);
      setLoading(false);

      if (success) {
        handleClose();
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during signin:", error);
      setError("An unexpected error occurred.");
    }
  };
  
  const fillDemo = () => {
      setEmail("alex@example.com");
      setPassword("password123");
  };

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="glass-modal">
      <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25">
        <Modal.Title style={{ fontFamily: 'var(--font-header)' }}>
            {isDemo ? "Demo Login" : "Login"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark-glass text-white border-secondary border-opacity-25"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dark-glass text-white border-secondary border-opacity-25"
            />
          </Form.Group>
            
          {error && <div className="text-danger mb-3 text-center">{error}</div>}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={loading} size="lg">
              {loading ? "Logging in..." : "Login"}
            </Button>
            {!isDemo && (
                <Button variant="outline-info" onClick={fillDemo} size="sm" className="mt-2">
                    Use Demo Credentials
                </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-top border-secondary border-opacity-25 justify-content-center">
          <p className="mb-0 text-muted small">
            Don't have an account? <span className="text-primary cursor-pointer" style={{cursor:'pointer'}} onClick={() => { handleClose(); navigate('/authentication/signup'); }}>Sign Up</span>
          </p>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
