import React, { useState, useEffect } from "react";
import "./HeroBanner.css";

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [animatedServices, setAnimatedServices] = useState<string[]>([]);

  const serviceCategories = [
    {
      icon: "🧑‍💻",
      title: "Technology & Programming",
      services: [
        "Website development (HTML, CSS, JavaScript, React, etc.)",
        "Mobile app development (Android, iOS, Flutter, React Native)",
        "Software development (Java, C#, Python, etc.)",
        "WordPress / CMS customization",
        "E-commerce website setup (Shopify, WooCommerce)",
        "API integration",
        "Bug fixing & debugging",
        "Game development",
        "Blockchain & Web3 development",
        "AI/ML solutions and chatbot creation",
      ],
    },
    {
      icon: "🎨",
      title: "Design & Creative",
      services: [
        "Logo design",
        "UI/UX design",
        "Graphic design (banners, posters, brochures)",
        "Video editing & motion graphics",
        "3D modeling and animation",
        "Illustration and character design",
        "Presentation design",
        "Packaging and product design",
      ],
    },
    {
      icon: "✍️",
      title: "Writing & Content",
      services: [
        "Article and blog writing",
        "Copywriting",
        "Technical writing",
        "Resume and cover letter writing",
        "Script writing (for videos or ads)",
        "Translation & transcription",
        "Proofreading and editing",
      ],
    },
    {
      icon: "📢",
      title: "Digital Marketing",
      services: [
        "Social media marketing (Instagram, Facebook, LinkedIn)",
        "SEO (Search Engine Optimization)",
        "SEM (Google Ads, PPC campaigns)",
        "Email marketing",
        "Content marketing",
        "Influencer outreach",
        "Brand strategy",
        "YouTube marketing",
      ],
    },
    {
      icon: "📸",
      title: "Media & Photography",
      services: [
        "Product photography",
        "Video production",
        "Photo retouching",
        "Animation explainer videos",
        "Drone photography",
      ],
    },
    {
      icon: "💼",
      title: "Business & Consulting",
      services: [
        "Business planning and strategy",
        "Market research",
        "Financial modeling",
        "Data analysis",
        "Virtual assistant services",
        "Customer support",
        "Project management",
      ],
    },
    {
      icon: "🧮",
      title: "Data & Analytics",
      services: [
        "Data entry",
        "Excel/Google Sheets automation",
        "Data visualization (Power BI, Tableau)",
        "Database management",
        "Statistical analysis",
      ],
    },
    {
      icon: "🎓",
      title: "Education & Training",
      services: [
        "Online tutoring (school subjects, coding, languages, etc.)",
        "Career guidance and mentoring",
        "Course material preparation",
        "Assignment or project help",
      ],
    },
    {
      icon: "🛍️",
      title: "Lifestyle & Others",
      services: [
        "Voice-over and narration",
        "Music composition",
        "Fitness coaching",
        "Astrology and tarot reading",
        "Relationship advice",
        "Personal styling",
      ],
    },
  ];

  const trustedCompanies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "Spotify",
    "Uber",
    "Airbnb",
    "Shopify",
    "Slack",
    "Zoom",
    "Adobe",
    "Intel",
    "IBM",
    "Salesforce",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle category hover with animation
  const handleCategoryHover = (categoryTitle: string) => {
    setHoveredCategory(categoryTitle);
    setAnimatedServices([]);

    const category = serviceCategories.find(
      (cat) => cat.title === categoryTitle
    );
    if (category) {
      // Animate services one by one
      category.services.forEach((service, index) => {
        setTimeout(() => {
          setAnimatedServices((prev) => [...prev, service]);
        }, index * 100); // 100ms delay between each service
      });
    }
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
    setAnimatedServices([]);
  };

  const getVisibleCategories = () => {
    const startIndex = currentSlide * 3;
    return serviceCategories.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="hero-banner">
      <div className="hero-container">
        {/* Main Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span>🚀 World's Largest Freelance Marketplace</span>
          </div>

          <h1 className="hero-title">
            Find Expert
            <span className="title-gradient"> Freelancers</span>
          </h1>

          <p className="hero-subtitle">
            Access millions of skilled professionals across all industries. From
            quick tasks to complex projects, get it done with top global talent.
          </p>

          {/* Stats Section */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">5M+</div>
              <div className="stat-label">Freelancers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <button className="cta-primary">
              <span className="btn-icon">💼</span>
              Post a Project
              <span className="btn-arrow">→</span>
            </button>
            <button className="cta-secondary">
              <span className="btn-icon">👨‍💻</span>
              Browse Services
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="trust-text">
              Trusted by industry leaders worldwide
            </div>
            <div className="company-logos">
              {trustedCompanies.slice(0, 8).map((company, index) => (
                <span key={index} className="company-logo">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="services-section">
          <div className="services-header">
            <h3 className="services-title">Service Categories</h3>
            <div className="slide-indicators">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`indicator ${
                    currentSlide === index ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))}
            </div>
          </div>

          <div className="categories-grid">
            {getVisibleCategories().map((category, index) => (
              <div
                key={index}
                className="category-card"
                onMouseEnter={() => handleCategoryHover(category.title)}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="category-icon">{category.icon}</div>
                <h4 className="category-title">{category.title}</h4>

                {/* Hover Popup */}
                {hoveredCategory === category.title && (
                  <div className="services-popup">
                    <div className="popup-header">
                      <span className="popup-icon">{category.icon}</span>
                      <h5 className="popup-title">{category.title}</h5>
                    </div>
                    <div className="popup-services">
                      {animatedServices.map((service, serviceIndex) => (
                        <div
                          key={serviceIndex}
                          className="popup-service-item"
                          style={{ animationDelay: `${serviceIndex * 0.1}s` }}
                        >
                          {service}
                        </div>
                      ))}
                    </div>
                    <button className="popup-cta">
                      Browse {category.services.length}+ Services
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="services-note">
            <span>
              Slide {currentSlide + 1} of 3 • {serviceCategories.length}{" "}
              categories available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
