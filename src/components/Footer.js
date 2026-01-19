import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <span className="footer-brand">NaviGrade</span>
          <span className="copyright">© 2024 All Rights Reserved</span>
        </div>
        
        <div className="footer-section social-links">
          <a href="https://twitter.com/NaviGradeCo" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://www.instagram.com/navigrade/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61557645166638" target="_blank" rel="noreferrer">Facebook</a>
        </div>

        <div className="footer-section">
          <a href="mailto:navigradecontact@gmail.com" className="email-link">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
