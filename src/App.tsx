import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import HowItWorks from "./components/HowItWorks";
import GlobalNetwork from "./components/GlobalNetwork";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import PortfolioBuilder from "./components/PortfolioBuilder";
import AboutUs from "./components/AboutUs/AboutUs";
import HelpSupport from "./components/HelpSupport/HelpSupport";
import ChatBot from "./components/ChatBot/ChatBot"; // Add this import
import ChatTrigger from "./components/ChatTrigger/ChatTrigger"; // Add this import

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // Add chat state

  const freelancerCategories = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Graphic Design",
    "Video Editing",
    "Data Analysis",
    "Virtual Assistant",
    "Business Consulting",
  ];

  const experienceLevels = ["Beginner", "Intermediate", "Expert", "Top Rated"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const highlightEvent = new CustomEvent("highlightCategories");
    window.dispatchEvent(highlightEvent);
    console.log("Searching for:", {
      searchTerm,
      location,
      category,
      experience,
    });
  };

  const handlePostProject = () => {
    console.log("Navigate to post project page");
  };

  // Chat functions
  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // 👇 ADDED: Re-trigger animation when section is visible
  useEffect(() => {
    const title = document.querySelectorAll(".title-word");
    const subtitle = document.querySelector(".animated-subtitle");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Restart animations
            title.forEach((el) => {
              (el as HTMLElement).style.animation = "none";
              (el as HTMLElement).offsetHeight; // reflow
              (el as HTMLElement).style.animation = "";
            });
            if (subtitle) {
              (subtitle as HTMLElement).style.animation = "none";
              (subtitle as HTMLElement).offsetHeight;
              (subtitle as HTMLElement).style.animation = "";
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const section = document.querySelector(".hire-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);
  // 👆 END CHANGE

  return (
    <Router>
      <div className="App">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroBanner id="categories" />
                  <HowItWorks id="how-it-works" />

                  {/* Browse Jobs Section - Clean Animated Search Form */}
                  <section id="hire" className="hire-section">
                    <div className="container">
                      <div className="section-header">
                        <h2 className="animated-title">
                          <span className="title-word">Find</span>
                          <span className="title-word">Perfect</span>
                          <span className="title-word">Freelancers</span>
                        </h2>
                        <p className="animated-subtitle">
                          Discover top talent for your projects
                        </p>
                      </div>

                      {/* Animated Search Form */}
                      <div className="search-form-container slide-in">
                        <form onSubmit={handleSearch} className="search-form">
                          {/* Main Search Input */}
                          <div className="search-hero">
                            <div className="search-input-container">
                              <input
                                type="text"
                                placeholder="What skills are you looking for? e.g., React Developer, UI Designer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="hero-search-input"
                              />
                              <div className="search-decoration">
                                <div className="pulse-dot"></div>
                              </div>
                            </div>
                          </div>

                          {/* Filter Row */}
                          <div className="filters-row">
                            <div
                              className="filter-group fade-in"
                              style={{ animationDelay: "0.2s" }}
                            >
                              <div className="filter-icon">📁</div>
                              <div className="select-wrapper">
                                <select
                                  value={category}
                                  onChange={(e) => setCategory(e.target.value)}
                                  className="filter-select animated-dropdown"
                                >
                                  <option value="">All Categories</option>
                                  <option value="Web Development">
                                    Web Development
                                  </option>
                                  <option value="Mobile App Development">
                                    Mobile App Development
                                  </option>
                                  <option value="UI/UX Design">
                                    UI/UX Design
                                  </option>
                                  <option value="Digital Marketing">
                                    Digital Marketing
                                  </option>
                                  <option value="Content Writing">
                                    Content Writing
                                  </option>
                                  <option value="Graphic Design">
                                    Graphic Design
                                  </option>
                                  <option value="Video Editing">
                                    Video Editing
                                  </option>
                                  <option value="Data Analysis">
                                    Data Analysis
                                  </option>
                                </select>
                                <div className="select-arrow">▼</div>
                              </div>
                            </div>

                            <div
                              className="filter-group fade-in"
                              style={{ animationDelay: "0.4s" }}
                            >
                              <div className="filter-icon">⭐</div>
                              <div className="select-wrapper">
                                <select
                                  value={experience}
                                  onChange={(e) =>
                                    setExperience(e.target.value)
                                  }
                                  className="filter-select animated-dropdown"
                                >
                                  <option value="">Any Experience</option>
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">
                                    Intermediate
                                  </option>
                                  <option value="Expert">Expert</option>
                                  <option value="Top Rated">Top Rated</option>
                                </select>
                                <div className="select-arrow">▼</div>
                              </div>
                            </div>

                            <div
                              className="filter-group fade-in"
                              style={{ animationDelay: "0.6s" }}
                            >
                              <div className="filter-icon">🌍</div>
                              <div className="select-wrapper">
                                <select
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  className="filter-select animated-dropdown"
                                >
                                  <option value="">Any Location</option>
                                  <option value="Remote">Remote Only</option>
                                  <option value="USA">United States</option>
                                  <option value="Europe">Europe</option>
                                  <option value="Asia">Asia</option>
                                  <option value="Global">Global</option>
                                </select>
                                <div className="select-arrow">▼</div>
                              </div>
                            </div>
                          </div>

                          {/* Search Button */}
                          <div
                            className="search-action fade-in"
                            style={{ animationDelay: "0.8s" }}
                          >
                            <button type="submit" className="glow-search-btn">
                              <span className="btn-sparkle">✨</span>
                              Search Freelancers
                              <span className="btn-arrow">→</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </section>

                  <GlobalNetwork id="global-network" />
                  <Testimonials id="testimonials" />
                </>
              }
            />

            {/* Portfolio Builder Route */}
            <Route path="/portfolio" element={<PortfolioBuilder />} />

            {/* About Us Route - ADDED */}
            <Route path="/about" element={<AboutUs />} />

            {/* Help & Support Route - ADDED */}
            <Route path="/help-support" element={<HelpSupport />} />
          </Routes>

          <Footer />
        </div>

        {/* Chat System - Add these components at the bottom */}
        <ChatTrigger onClick={handleChatToggle} />
        <ChatBot isOpen={isChatOpen} onClose={handleCloseChat} />
      </div>
    </Router>
  );
}

export default App;
