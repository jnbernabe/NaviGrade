// Home.js

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Home.css"; // Import the new CSS

const Home = () => {
  const { user } = useAuth();
  
  const features = [
    {
      title: "Course Tracking",
      desc: "Keep all your courses organized in one place with detailed insights.",
      icon: "📚"
    },
    {
      title: "Assignment Management",
      desc: "Never miss a deadline with our intuitive assignment tracker.",
      icon: "📝"
    },
    {
      title: "Grade Recording",
      desc: "Log your grades and monitor your academic performance in real-time.",
      icon: "📊"
    },
    {
      title: "Smart Estimations",
      desc: "Get intelligent predictions for your final grades based on current progress.",
      icon: "🧠"
    },
    {
      title: "Deadline Reminders",
      desc: "Stay ahead with automated reminders for upcoming due dates.",
      icon: "⏰"
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h1 className="hero-title">
                Master Your Academic Journey with NaviGrade
              </h1>
              <p className="hero-subtitle">
                The all-in-one solution for managing courses, tracking assignments, 
                and visualizing your grades. Stay organized, stay ahead.
              </p>
              
              {!user && (
                <div className="cta-group">
                  <Link to="/authentication/signup">
                    <Button variant="primary" className="btn-hero">
                      Get Started for Free
                    </Button>
                  </Link>
                  <Link to="/authentication/signin">
                    <Button variant="secondary" className="btn-hero">
                      Log In
                    </Button>
                  </Link>
                </div>
              )}
              
              {user && (
                <div className="cta-group">
                  <Link to="/dashboard">
                    <Button variant="primary" className="btn-hero">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section fade-in-up delay-1">
        <div className="section-label">Key Features</div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`glass-panel feature-card fade-in-up delay-${index + 1}`}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
