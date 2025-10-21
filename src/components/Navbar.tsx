import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section - UPDATED: Now links to About Us */}
        <div className="logo-section">
          <Link to="/about" className="logo-link">
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
          </Link>
        </div>

        {/* Navigation Menu - UPDATED: Added Home link */}
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            <span>Home</span>
          </Link>
          <a href="#how-it-works" className="nav-link">
            <span>How It Works</span>
          </a>
          <a href="#hire" className="nav-link">
            <span>Browse Jobs</span>
          </a>
          <Link to="/portfolio" className="nav-link">
            <span>Create Portfolio</span>
          </Link>
        </div>

        {/* Auth Section */}
        <div className="nav-actions">
          <div className="auth-buttons">
            <a href="#login" className="login-btn">
              Log In
            </a>
            <a href="#signup" className="signup-btn">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
