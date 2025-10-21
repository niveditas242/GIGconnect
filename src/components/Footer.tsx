import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleFindTalent = (e: React.MouseEvent) => {
    e.preventDefault();

    // If we're already on home page, just scroll to section
    if (window.location.pathname === "/") {
      const hireSection = document.getElementById("hire");
      if (hireSection) {
        hireSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Navigate to home page and then scroll
      window.location.href = "/#hire";
    }
  };

  const handlePostProject = (e: React.MouseEvent) => {
    e.preventDefault();

    // If we're already on home page, just scroll to section
    if (window.location.pathname === "/") {
      const hireSection = document.getElementById("hire");
      if (hireSection) {
        hireSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Navigate to home page and then scroll
      window.location.href = "/#hire";
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Main Footer Links */}
          <div className="footer-links-section">
            <div className="footer-column">
              <div className="footer-brand">
                <div className="logo-container">
                  <img
                    src="/src/assets/logos/img7.png"
                    alt="GigConnect"
                    className="footer-logo"
                  />
                  <div className="logo-glow"></div>
                  <div className="logo-pulse"></div>
                </div>
                <p className="footer-description">
                  Connecting talented freelancers with clients worldwide for
                  successful collaborations.
                </p>
              </div>
            </div>

            {/* Create Portfolio Section */}
            <div className="footer-column">
              <h4 className="footer-title">Create Portfolio</h4>
              <div className="footer-links">
                <Link to="/portfolio" className="footer-link">
                  Portfolio Builder
                </Link>
                <Link to="/portfolio" className="footer-link">
                  Add Projects
                </Link>
                <Link to="/portfolio" className="footer-link">
                  Showcase Skills
                </Link>
                <Link to="/portfolio" className="footer-link">
                  Get Discovered
                </Link>
              </div>
            </div>

            {/* For Clients Section */}
            <div className="footer-column">
              <h4 className="footer-title">For Clients</h4>
              <div className="footer-links">
                <a
                  href="/#hire"
                  className="footer-link"
                  onClick={handlePostProject}
                >
                  Post a Project
                </a>
                <a
                  href="/#hire"
                  className="footer-link"
                  onClick={handleFindTalent}
                >
                  Find Talent
                </a>
                <a href="/hiring-guide" className="footer-link">
                  Hiring Guide
                </a>
              </div>
            </div>

            {/* Help Center Section - UPDATED */}
            <div className="footer-column">
              <h4 className="footer-title">Help Center</h4>
              <div className="footer-links">
                <Link to="/contact-support" className="footer-link">
                  Help & Support
                </Link>
                <a href="/faq" className="footer-link">
                  FAQ
                </a>
                <Link to="/contact-support" className="footer-link">
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Company Section */}
            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <div className="footer-links">
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
                <a href="/careers" className="footer-link">
                  Careers
                </a>
                <a href="/blog" className="footer-link">
                  Blog
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              © {currentYear} GigConnect. All Rights Reserved.
            </div>
            <div className="footer-legal">
              <a href="/privacy" className="footer-legal-link">
                Privacy Policy
              </a>
              <a href="/terms" className="footer-legal-link">
                Terms of Service
              </a>
              <Link to="/contact-support" className="footer-legal-link">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
