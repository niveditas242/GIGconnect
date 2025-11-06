// src/components/GlobalNetwork.tsx
import React, { useState, useEffect, useRef } from "react";
import "./GlobalNetwork.css";
import { BaseComponentProps } from "../types";

const GlobalNetwork: React.FC<BaseComponentProps> = ({ id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Move stats outside of component or use useMemo to prevent recreation
  const stats = [
    { target: 50, suffix: "K+", label: "Freelancers" },
    { target: 100, suffix: "+", label: "Countries" },
    { target: 95, suffix: "%", label: "Success Rate" },
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

  // Counter animations - FIXED: Remove stats from dependencies
  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const counterInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounter1(Math.floor(50 * progress));
        setCounter2(Math.floor(100 * progress));
        setCounter3(Math.floor(95 * progress));

        if (currentStep >= steps) {
          clearInterval(counterInterval);
          // Set final values
          setCounter1(50);
          setCounter2(100);
          setCounter3(95);
        }
      }, stepDuration);

      return () => clearInterval(counterInterval);
    }
  }, [isVisible]); // Removed stats from dependencies

  return (
    <section className="global-network" ref={sectionRef} id={id}>
      <div className="container">
        <div className={`network-content ${isVisible ? "animate-in" : ""}`}>
          <h2 className="network-title">Tap into a global talent network</h2>
          <p className="network-description">
            Connect with skilled professionals from around the world to get your
            projects done efficiently.
          </p>
          <div className="network-stats">
            <div className="stat">
              <div className="stat-number">{counter1}K+</div>
              <div className="stat-label">Freelancers</div>
            </div>
            <div className="stat">
              <div className="stat-number">{counter2}+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat">
              <div className="stat-number">{counter3}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalNetwork;
