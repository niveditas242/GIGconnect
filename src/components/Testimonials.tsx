import React, { useState, useEffect, useRef } from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      id: 1,
      quote:
        "Your talent is the bridge between imagination and reality. Build it with passion, and the world will cross oceans to find you.",
      author: "For Creative Minds",
      type: "freelancer",
      character: "👨‍💻",
      animation: "bounce",
      bgColor: "#3498db",
    },
    {
      id: 2,
      quote:
        "Behind every great project is a visionary client who dared to dream and a talented freelancer who made it breathe.",
      author: "For Visionaries",
      type: "client",
      character: "👔",
      animation: "wiggle",
      bgColor: "#2c3e50",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="testimonials" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Where Talent Meets Opportunity</h2>
        <p className="section-subtitle">
          Building dreams together, one project at a time
        </p>

        <div className={`testimonials-grid ${isVisible ? "animate-in" : ""}`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-card ${testimonial.type}`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {/* Animated Character with Speech Bubble */}
              <div className="character-container">
                <div className={`character ${testimonial.animation}`}>
                  {testimonial.character}
                </div>
                <div className="speech-bubble">
                  <div className="bubble-tail"></div>
                </div>
              </div>

              <div className="testimonial-content">
                <div className="testimonial-text">
                  <span className="quote-mark">"</span>
                  {testimonial.quote}
                  <span className="quote-mark">"</span>
                </div>

                <div className="testimonial-author">
                  <div className="author-name">{testimonial.author}</div>
                  <div className="author-role">
                    {testimonial.type === "freelancer"
                      ? "Freelancer Spirit"
                      : "Client Wisdom"}
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="floating-elements">
                <div className="floating-dot dot-1"></div>
                <div className="floating-dot dot-2"></div>
                <div className="floating-dot dot-3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Central Collaboration Animation */}
        <div className="collaboration-scene">
          <div className="collaboration-character left">👨‍💻</div>
          <div className="collaboration-character right">👔</div>
          <div className="project-sparkle">✨</div>
          <div className="connection-beam"></div>
          <div className="success-badge">Successful Collaboration!</div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
