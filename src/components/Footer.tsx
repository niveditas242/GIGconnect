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

            {/* Create Portfolio Section */}
            <div className="footer-column">
              <h4 className="footer-title">Create Portfolio</h4>
              <div className="footer-links">
                <a href="/portfolio-builder" className="footer-link">
                  Portfolio Builder
                </a>
                <a href="/add-projects" className="footer-link">
                  Add Projects
                </a>
                <a href="/skills-showcase" className="footer-link">
                  Showcase Skills
                </a>
                <a href="/get-discovered" className="footer-link">
                  Get Discovered
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
                <a href="/hiring-guide" className="footer-link">
                  Hiring Guide
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Help Center</h4>
              <div className="footer-links">
                <a href="/help-center" className="footer-link">
                  Help & Support
                </a>
                <a href="/faq" className="footer-link">
                  FAQ
                </a>
                <a href="/contact-support" className="footer-link">
                  Contact Support
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
