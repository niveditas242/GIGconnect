import React, { useState } from "react";
import "./HelpSupport.css";

const HelpSupport: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your message has been sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="help-support">
      <div className="help-container">
        {/* Hero Section */}
        <section className="help-hero">
          <h1 className="help-title">How can we help you?</h1>
          <p className="help-subtitle">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </section>

        <div className="help-divider"></div>

        {/* Contact Information */}
        <section className="contact-info">
          <div className="contact-section">
            <h2 className="section-title">OUR MAIN OFFICE</h2>
            <p className="contact-detail">
              SoHo 94 Broadway St
              <br />
              New York, NY 10001
            </p>
          </div>

          <div className="contact-section">
            <h2 className="section-title">PHONE NUMBER</h2>
            <p className="contact-detail">
              <a href="tel:234-9876-5400">234-9876-5400</a>
              <br />
              <a href="tel:888-0123-4567">888-0123-4567 (Toll Free)</a>
            </p>
          </div>

          <div className="contact-section">
            <h2 className="section-title">FAX</h2>
            <p className="contact-detail">
              <a href="fax:1-234-567-8900">1-234-567-8900</a>
            </p>
          </div>

          <div className="contact-section">
            <h2 className="section-title">EMAIL</h2>
            <p className="contact-detail">
              <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>
            </p>
          </div>
        </section>

        {/* Support Options */}
        <section className="support-sections">
          <div className="support-grid">
            <div className="support-card">
              <div className="card-icon">❓</div>
              <h3>FAQ & Knowledge Base</h3>
              <p>
                Find quick answers to common questions in our comprehensive
                knowledge base.
              </p>
              <button className="support-btn">Browse FAQs</button>
            </div>

            <div className="support-card">
              <div className="card-icon">💬</div>
              <h3>Live Chat Support</h3>
              <p>
                Get instant help from our support team through live chat during
                business hours.
              </p>
              <button className="support-btn">Start Chat</button>
            </div>

            <div className="support-card">
              <div className="card-icon">📚</div>
              <h3>Documentation</h3>
              <p>
                Detailed guides and documentation to help you make the most of
                our platform.
              </p>
              <button className="support-btn">View Docs</button>
            </div>
          </div>
        </section>

        {/* ✉️ Contact Form Section */}
        <section className="contact-form-section">
          <h2 className="section-title">SEND US A MESSAGE</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="support-btn">
              Send Message
            </button>
          </form>
        </section>

        {/* Business Hours */}
        <section className="business-hours">
          <h2 className="section-title">BUSINESS HOURS</h2>
          <div className="hours-grid">
            <div className="hours-item">
              <span className="day">Monday - Friday</span>
              <span className="time">9:00 AM - 6:00 PM EST</span>
            </div>
            <div className="hours-item">
              <span className="day">Saturday</span>
              <span className="time">10:00 AM - 4:00 PM EST</span>
            </div>
            <div className="hours-item">
              <span className="day">Sunday</span>
              <span className="time">Closed</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpSupport;
