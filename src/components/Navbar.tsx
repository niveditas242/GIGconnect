import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import UserMenu from "./UserMenu";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
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

        {/* Navigation Menu */}
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <a href="#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="#hire" className="nav-link">
            Browse Jobs
          </a>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
        </div>

        {/* User Menu Section */}
        <div className="nav-actions">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
