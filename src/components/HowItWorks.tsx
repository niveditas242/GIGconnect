import React, { useState, useEffect, useRef } from "react";
import "./HowItWorks.css";

// Add the TypeScript interface for props
interface HowItWorksProps {
  id: string;
  className?: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ id }) => {
  const [displayTitle, setDisplayTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const title = "How It Works";
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "1",
      title: "Post a Project",
      description: "Describe your project and requirements.",
      icon: "📋",
      animation: "bounce",
    },
    {
      number: "2",
      title: "Hire Talent",
      description: "Select the best freelancer for your project.",
      icon: "👥",
      animation: "bounce",
    },
    {
      number: "3",
      title: "Get Work Done",
      description: "Review work and make payments securely.",
      icon: "✅",
      animation: "bounce",
    },
  ];

  // Typing animation for title
  useEffect(() => {
    if (titleIndex < title.length) {
      const timer = setTimeout(() => {
        setDisplayTitle(title.substring(0, titleIndex + 1));
        setTitleIndex(titleIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setTypingComplete(true);
      // Start line animation after title finishes
      setTimeout(() => {
        animateLine();
      }, 500);
    }
  }, [titleIndex, title]);

  // Line typing animation
  const animateLine = () => {
    const totalDuration = 1500;
    const stepsCount = 30;
    const stepDuration = totalDuration / stepsCount;

    let currentStep = 0;

    const lineInterval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / stepsCount) * 100;
      setLineProgress(progress);

      if (currentStep >= stepsCount) {
        clearInterval(lineInterval);
        // Show steps after line completes
        setTimeout(() => {
          setShowSteps(true);
        }, 300);
      }
    }, stepDuration);
  };

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && titleIndex === 0) {
          setTitleIndex(0); // Start typing animation
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
    <section className="how-it-works" ref={sectionRef} id={id}>
      <div className="container">
        <h2 className="section-title typing-title">
          {displayTitle}
          {!typingComplete && <span className="typing-cursor">|</span>}
        </h2>

        <div className="steps-wrapper">
          <div className="steps-container">
            {/* Animated connector line - only show when typing is complete */}
            {typingComplete && (
              <div className="connector-line">
                <div
                  className="line-progress"
                  style={{ width: `${lineProgress}%` }}
                ></div>
                {lineProgress > 0 && lineProgress < 100 && (
                  <div
                    className="line-cursor"
                    style={{ left: `${lineProgress}%` }}
                  ></div>
                )}
              </div>
            )}

            {/* Steps - only show when line animation is complete */}
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-card step-${index + 1} ${
                  showSteps ? "step-visible" : ""
                }`}
                style={{
                  opacity: showSteps ? 0 : 1,
                  animationDelay: showSteps ? `${index * 0.3}s` : "0s",
                }}
              >
                <div className={`step-icon ${step.animation}`}>{step.icon}</div>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
