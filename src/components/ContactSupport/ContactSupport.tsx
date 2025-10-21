import React, { useState } from "react";
import "./ContactSupport.css";

const ContactSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"support" | "help" | "faq">(
    "support"
  );
  const [query, setQuery] = useState("");

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    alert("Email address copied to clipboard!");
  };

  const handleSendQuery = () => {
    if (!query.trim()) {
      alert("Please type your query before sending.");
      return;
    }

    let email = "";
    let subject = "";

    if (activeTab === "help") {
      email = "help@gigconnect.com";
      subject = "Help Documentation Query";
    } else if (activeTab === "faq") {
      email = "faq@gigconnect.com";
      subject = "FAQ Support Query";
    }

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(query)}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div className="contact-support">
      {/* Hero Section */}
      <section className="support-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Contact Support</h1>
            <p>Get in touch with our support team</p>
          </div>
        </div>
      </section>

      <div className="support-container">
        <div className="simple-contact-content">
          <div className="simple-contact-card">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button
                className={`tab-btn ${activeTab === "support" ? "active" : ""}`}
                onClick={() => setActiveTab("support")}
              >
                📧 General Support
              </button>
              <button
                className={`tab-btn ${activeTab === "help" ? "active" : ""}`}
                onClick={() => setActiveTab("help")}
              >
                📖 Help Documentation
              </button>
              <button
                className={`tab-btn ${activeTab === "faq" ? "active" : ""}`}
                onClick={() => setActiveTab("faq")}
              >
                ❓ FAQ Support
              </button>
            </div>

            {/* Support Tab Content */}
            {activeTab === "support" && (
              <div className="tab-content">
                <div className="email-icon">📧</div>
                <h2>Email Us Directly</h2>
                <p className="contact-description">
                  For any questions, issues, or inquiries, please email us
                  directly at:
                </p>

                <div
                  className="email-display"
                  onClick={() => copyEmail("support@gigconnect.com")}
                >
                  <span className="email-address">support@gigconnect.com</span>
                  <button className="copy-btn">Copy</button>
                </div>

                <div className="contact-instructions">
                  <h3>How to Contact Us:</h3>
                  <ol className="instructions-list">
                    <li>Open your email application</li>
                    <li>
                      Compose a new email to:{" "}
                      <strong>support@gigconnect.com</strong>
                    </li>
                    <li>Clearly describe your issue or question</li>
                    <li>Include any relevant details or screenshots</li>
                    <li>Send the email and we'll respond within 24 hours</li>
                  </ol>
                </div>

                <div className="response-info">
                  <h4>📅 Response Time</h4>
                  <p>
                    We typically respond to all emails within{" "}
                    <strong>24 hours</strong> during business days (Monday -
                    Friday, 9AM - 6PM).
                  </p>
                </div>
              </div>
            )}

            {/* Help Documentation Tab Content */}
            {activeTab === "help" && (
              <div className="tab-content">
                <div className="email-icon">📖</div>
                <h2>Help Documentation</h2>
                <p className="contact-description">
                  For technical documentation and platform guides, type your
                  query below and send it directly to our help team.
                </p>

                <div className="query-section">
                  <label className="query-label">Type your query:</label>
                  <textarea
                    className="query-input"
                    placeholder="Please describe your technical issue or question in detail..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={6}
                  />

                  <div className="email-info">
                    <strong>Email will be sent to: help@gigconnect.com</strong>
                  </div>

                  <button className="send-query-btn" onClick={handleSendQuery}>
                    Send Your Query
                  </button>
                </div>

                <div className="response-info">
                  <h4>📋 What to Include:</h4>
                  <ul className="instructions-list">
                    <li>Detailed description of your technical issue</li>
                    <li>Steps to reproduce the problem</li>
                    <li>Any error messages you're seeing</li>
                    <li>Your platform and browser information</li>
                  </ul>
                </div>
              </div>
            )}

            {/* FAQ Tab Content */}
            {activeTab === "faq" && (
              <div className="tab-content">
                <div className="email-icon">❓</div>
                <h2>FAQ Support</h2>
                <p className="contact-description">
                  For frequently asked questions and general inquiries, type
                  your query below and send it to our FAQ team.
                </p>

                <div className="query-section">
                  <label className="query-label">Type your query:</label>
                  <textarea
                    className="query-input"
                    placeholder="Please type your question or inquiry here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={6}
                  />

                  <div className="email-info">
                    <strong>Email will be sent to: faq@gigconnect.com</strong>
                  </div>

                  <button className="send-query-btn" onClick={handleSendQuery}>
                    Send Your Query
                  </button>
                </div>

                <div className="response-info">
                  <h4>💡 Before You Ask:</h4>
                  <ul className="instructions-list">
                    <li>
                      Check if your question is already answered in our FAQ
                    </li>
                    <li>Be specific about what you need help with</li>
                    <li>Include your account username if relevant</li>
                    <li>Let us know how we can better assist you</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
