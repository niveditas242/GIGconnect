import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const handleHireTalent = () => {
    // Navigate to home page first
    navigate("/");

    // Then scroll to the hire section after a small delay
    setTimeout(() => {
      const hireSection = document.getElementById("hire");
      if (hireSection) {
        hireSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleJoinFreelancer = () => {
    navigate("/portfolio");
  };

  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>About GIGconnect</h1>
            <p>Connecting Top Talent with Amazing Opportunities Worldwide</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To democratize access to global opportunities by creating a
                seamless platform where talented professionals can connect with
                businesses that value their skills, regardless of geographical
                boundaries.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To build the world's most trusted freelance ecosystem where
                talent meets opportunity, fostering economic growth and
                empowering individuals to work on their own terms.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">💡</div>
              <h3>Our Values</h3>
              <p>
                Transparency, Quality, Innovation, and Community. We believe in
                creating meaningful connections that benefit both freelancers
                and clients equally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2024, GIGconnect emerged from a simple observation:
                the world is full of incredible talent, but connecting with the
                right opportunities remains a challenge. We saw the need for a
                platform that goes beyond traditional job boards - one that
                understands the unique needs of both freelancers and businesses.
              </p>
              <p>
                What started as a vision to bridge the gap between talent and
                opportunity has evolved into a comprehensive ecosystem
                supporting thousands of professionals worldwide. Our platform is
                built by freelancers, for freelancers, with a deep understanding
                of what it takes to succeed in today's dynamic work environment.
              </p>
            </div>
            <div className="story-stats">
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>Active Freelancers</p>
              </div>
              <div className="stat-item">
                <h3>5,000+</h3>
                <p>Completed Projects</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Countries Served</p>
              </div>
              <div className="stat-item">
                <h3>98%</h3>
                <p>Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h4>John Smith</h4>
              <p className="member-role">CEO & Founder</p>
              <p className="member-bio">
                Former tech lead with 10+ years in software development and
                platform architecture.
              </p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h4>Sarah Johnson</h4>
              <p className="member-role">CTO</p>
              <p className="member-bio">
                Full-stack developer and system architect passionate about
                building scalable solutions.
              </p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👨‍🎨</div>
              <h4>Mike Chen</h4>
              <p className="member-role">Head of Design</p>
              <p className="member-bio">
                UX/UI expert with a background in human-computer interaction and
                visual design.
              </p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👩‍💼</div>
              <h4>Emily Davis</h4>
              <p className="member-role">Community Manager</p>
              <p className="member-bio">
                Former freelance writer dedicated to building and nurturing our
                community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <h2>Why Choose GIGconnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h4>Global Reach</h4>
              <p>Connect with clients and talent from all around the world</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>Secure Payments</h4>
              <p>
                Protected transactions with escrow services and dispute
                resolution
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Fast Matching</h4>
              <p>
                AI-powered matching to connect you with perfect opportunities
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h4>Growth Tools</h4>
              <p>
                Portfolio builder, skill assessments, and career development
                resources
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h4>Community Support</h4>
              <p>Join a thriving community of professionals and mentors</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h4>Learning Resources</h4>
              <p>Access to courses, workshops, and industry insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - UPDATED with React Router navigation */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of professionals who are already building their
              dreams with GIGconnect
            </p>
            <div className="cta-buttons">
              <button onClick={handleJoinFreelancer} className="cta-primary">
                Join as Freelancer
              </button>
              <button onClick={handleHireTalent} className="cta-secondary">
                Hire Talent
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
