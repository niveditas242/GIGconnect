import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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

            <div className="footer-column">
              <h4 className="footer-title">For Freelancers</h4>
              <div className="footer-links">
                <a href="/find-work" className="footer-link">
                  Find Work
                </a>
                <a href="/portfolio" className="footer-link">
                  Create Portfolio
                </a>
                <a href="/resources" className="footer-link">
                  Resources
                </a>
                <a href="/community" className="footer-link">
                  Community
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">For Clients</h4>
              <div className="footer-links">
                <a href="/post-project" className="footer-link">
                  Post a Project
                </a>
                <a href="/find-talent" className="footer-link">
                  Find Talent
                </a>
                <a href="/enterprise" className="footer-link">
                  Enterprise
                </a>
                <a href="/solutions" className="footer-link">
                  Solutions
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <div className="footer-links">
                <a href="/about" className="footer-link">
                  About Us
                </a>
                <a href="/careers" className="footer-link">
                  Careers
                </a>
                <a href="/contact" className="footer-link">
                  Contact
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Support</h4>
              <div className="footer-links">
                <a href="/help" className="footer-link">
                  Help Center
                </a>
                <a href="/privacy" className="footer-link">
                  Privacy Policy
                </a>
                <a href="/terms" className="footer-link">
                  Terms of Service
                </a>
                <a href="/security" className="footer-link">
                  Security
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
              <a href="/contact" className="footer-legal-link">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
