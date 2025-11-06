import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./AboutUs.css";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const handleHireTalent = () => {
    navigate("/");
    setTimeout(() => {
      const hireSection = document.getElementById("hire");
      if (hireSection) {
        hireSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  return (
    <div className="about-us page-with-navbar">
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
                businesses that value their skills.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To build the world's most trusted freelance ecosystem where
                talent meets opportunity and individuals can work on their own
                terms.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">💡</div>
              <h3>Our Values</h3>
              <p>
                Transparency, Quality, Innovation, and Community — we build
                tools that benefit both freelancers and clients equally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-inner">
            <div className="story-left">
              <h2>Our Story</h2>
              <p>
                Founded in 2024, GIGconnect emerged from a simple observation:
                the world is full of incredible talent, but connecting with the
                right opportunities remains a challenge. We saw the need for a
                platform that goes beyond traditional job boards — one that
                understands the unique needs of both freelancers and businesses.
              </p>
              <p>
                What started as a vision to bridge the gap between talent and
                opportunity has evolved into a comprehensive ecosystem
                supporting thousands of professionals worldwide. Our platform is
                built by freelancers, for freelancers.
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
            {[
              {
                icon: "🌍",
                title: "Global Reach",
                desc: "Connect with clients and talent from all around the world",
              },
              {
                icon: "🛡️",
                title: "Secure Payments",
                desc: "Protected transactions with escrow and dispute support",
              },
              {
                icon: "⚡",
                title: "Fast Matching",
                desc: "AI-powered matching to find the right opportunities quickly",
              },
              {
                icon: "📈",
                title: "Growth Tools",
                desc: "Portfolio builder, assessments, and career resources",
              },
            ].map((feature, index) => (
              <motion.div
                className="feature-card"
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of businesses and freelancers using GIGconnect.
            </p>
            <div className="cta-buttons">
              <button onClick={handleHireTalent} className="cta-primary">
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
