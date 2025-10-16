import React from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <img
              src="/src/assets/logos/img7.png"
              alt="GIGconnect"
              className="logo-image"
            />
            <div className="logo-hover-effect"></div>
          </div>
          <div className="logo-text">
            <span className="logo-name">GIGconnect</span>
            <span className="logo-tagline">Find Top Talent</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="nav-menu">
          <a href="#how-it-works" className="nav-link">
            <span>How It Works</span>
          </a>
          <a href="#browse" className="nav-link">
            <span>Browse Jobs</span>
          </a>
          <a href="#categories" className="nav-link">
            <span>Categories</span>
          </a>
        </div>

        {/* Auth & CTA Section */}
        <div className="nav-actions">
          <div className="auth-buttons">
            <a href="#login" className="login-btn">
              Log In
            </a>
            <a href="#signup" className="signup-btn">
              Sign Up
            </a>
          </div>
          <button className="cta-button">
            <span className="cta-icon">🚀</span>
            Post a Project
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
