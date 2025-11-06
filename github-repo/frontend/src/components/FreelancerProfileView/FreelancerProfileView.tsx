import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

interface FreelancerProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  hourlyRate: number;
  experience: string;
  skills: string[];
  profileImage?: string;
  rating: number;
  completedProjects: number;
  responseTime: string;
  languages: string[];
  education?: string;
  socialLinks: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  portfolioProjects: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    category: string;
    liveUrl?: string;
    githubUrl?: string;
  }>;
  reviews: Array<{
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    date: string;
    project: string;
  }>;
}

const FreelancerProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "portfolio" | "reviews"
  >("overview");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock profile data
        const mockProfile: FreelancerProfile = {
          id: id || "1",
          name: "Sarah Johnson",
          title: "Senior Full Stack Developer",
          bio: "Experienced full-stack developer with 8+ years of expertise in building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about creating user-centric solutions and mentoring junior developers.",
          email: "sarah.johnson@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          hourlyRate: 85,
          experience: "Expert (8+ years)",
          skills: [
            "React",
            "TypeScript",
            "Node.js",
            "Python",
            "AWS",
            "MongoDB",
            "PostgreSQL",
            "Docker",
            "GraphQL",
          ],
          profileImage: "",
          rating: 4.9,
          completedProjects: 47,
          responseTime: "< 2 hours",
          languages: ["English", "Spanish"],
          education: "MSc Computer Science - Stanford University",
          socialLinks: {
            website: "https://sarahjohnson.dev",
            linkedin: "https://linkedin.com/in/sarahjohnson",
            github: "https://github.com/sarahjohnson",
          },
          portfolioProjects: [
            {
              id: "1",
              title: "E-commerce Platform",
              description:
                "Built a scalable e-commerce platform serving 10,000+ daily users. Implemented real-time inventory management and payment processing.",
              image: "",
              technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
              category: "web-development",
              liveUrl: "https://example-ecommerce.com",
              githubUrl: "https://github.com/sarahjohnson/ecommerce",
            },
            {
              id: "2",
              title: "Healthcare Analytics Dashboard",
              description:
                "Developed a comprehensive analytics dashboard for healthcare providers with real-time data visualization and reporting features.",
              image: "",
              technologies: [
                "React",
                "Python",
                "D3.js",
                "PostgreSQL",
                "Docker",
              ],
              category: "data-visualization",
              liveUrl: "https://healthcare-analytics.demo",
              githubUrl: "https://github.com/sarahjohnson/healthcare-dashboard",
            },
            {
              id: "3",
              title: "Mobile Banking App",
              description:
                "Led development of a secure mobile banking application with biometric authentication and real-time transaction processing.",
              image: "",
              technologies: [
                "React Native",
                "Node.js",
                "MongoDB",
                "Firebase",
                "JWT",
              ],
              category: "mobile-app",
              githubUrl: "https://github.com/sarahjohnson/banking-app",
            },
          ],
          reviews: [
            {
              id: "1",
              clientName: "TechCorp Inc.",
              rating: 5,
              comment:
                "Sarah delivered exceptional work on our e-commerce platform. Her attention to detail and technical expertise were impressive.",
              date: "2024-01-15",
              project: "E-commerce Platform",
            },
            {
              id: "2",
              clientName: "HealthPlus Systems",
              rating: 5,
              comment:
                "Outstanding developer! Sarah understood our complex requirements and delivered a robust solution ahead of schedule.",
              date: "2024-02-20",
              project: "Healthcare Analytics Dashboard",
            },
            {
              id: "3",
              clientName: "FinTech Solutions",
              rating: 4.5,
              comment:
                "Great communication and technical skills. The mobile app exceeded our expectations.",
              date: "2024-03-10",
              project: "Mobile Banking App",
            },
          ],
        };

        setProfile(mockProfile);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleContactFreelancer = () => {
    if (!user) {
      toast.info("Please login to contact freelancers");
      navigate("/login");
      return;
    }
    setIsContactModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would send a message
    toast.success("Message sent successfully!");
    setIsContactModalOpen(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < Math.floor(rating) ? "filled" : ""} ${
          index === Math.floor(rating) && rating % 1 !== 0 ? "half" : ""
        }`}
      >
        {index < Math.floor(rating)
          ? "★"
          : index === Math.floor(rating) && rating % 1 !== 0
          ? "⯨"
          : "☆"}
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="profile-view-loading">
        <div className="loading-spinner"></div>
        <p>Loading freelancer profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-not-found">
        <h2>Profile Not Found</h2>
        <p>The freelancer profile you're looking for doesn't exist.</p>
        <Link to="/" className="primary-btn">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="freelancer-profile-view">
      {/* Header Section */}
      <div className="profile-header-section">
        <div className="container">
          <div className="profile-header-content">
            <div className="profile-main-info">
              <div className="profile-avatar">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} />
                ) : (
                  <div className="avatar-initials">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-details">
                <h1>{profile.name}</h1>
                <p className="profile-title">{profile.title}</p>
                <div className="profile-meta">
                  <span className="location">📍 {profile.location}</span>
                  <span className="rating">
                    {renderStars(profile.rating)}
                    <strong>{profile.rating}</strong> (
                    {profile.completedProjects} projects)
                  </span>
                  <span className="response-time">
                    ⚡ {profile.responseTime} avg. response
                  </span>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <div className="hourly-rate">
                <span className="rate">${profile.hourlyRate}/hr</span>
              </div>
              <button
                onClick={handleContactFreelancer}
                className="contact-btn primary-btn"
              >
                💬 Contact Me
              </button>
              <button className="save-btn secondary-btn">
                💖 Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main-content">
        <div className="container">
          <div className="profile-layout">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="sidebar-section">
                <h3>Skills & Expertise</h3>
                <div className="skills-list">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3>Languages</h3>
                <div className="languages-list">
                  {profile.languages.map((language, index) => (
                    <span key={index} className="language-tag">
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {profile.education && (
                <div className="sidebar-section">
                  <h3>Education</h3>
                  <p>{profile.education}</p>
                </div>
              )}

              <div className="sidebar-section">
                <h3>Experience Level</h3>
                <p className="experience-badge">{profile.experience}</p>
              </div>

              {Object.values(profile.socialLinks).some((link) => link) && (
                <div className="sidebar-section">
                  <h3>Social Links</h3>
                  <div className="social-links">
                    {profile.socialLinks.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        🌐 Website
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        💼 LinkedIn
                      </a>
                    )}
                    {profile.socialLinks.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        💻 GitHub
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        🐦 Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="profile-content">
              {/* Navigation Tabs */}
              <div className="profile-tabs">
                <button
                  className={`tab ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`tab ${activeTab === "portfolio" ? "active" : ""}`}
                  onClick={() => setActiveTab("portfolio")}
                >
                  Portfolio ({profile.portfolioProjects.length})
                </button>
                <button
                  className={`tab ${activeTab === "reviews" ? "active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({profile.reviews.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "overview" && (
                  <div className="overview-tab">
                    <section className="bio-section">
                      <h2>About Me</h2>
                      <p>{profile.bio}</p>
                    </section>

                    <section className="stats-section">
                      <h2>Work Stats</h2>
                      <div className="stats-grid">
                        <div className="stat-card">
                          <div className="stat-value">
                            {profile.completedProjects}+
                          </div>
                          <div className="stat-label">Projects Completed</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-value">{profile.rating}/5</div>
                          <div className="stat-label">Client Rating</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-value">100%</div>
                          <div className="stat-label">Job Success</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-value">
                            {profile.responseTime}
                          </div>
                          <div className="stat-label">Response Time</div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "portfolio" && (
                  <div className="portfolio-tab">
                    <div className="projects-grid">
                      {profile.portfolioProjects.map((project) => (
                        <div key={project.id} className="project-card">
                          <div className="project-image">
                            {project.image ? (
                              <img src={project.image} alt={project.title} />
                            ) : (
                              <div className="project-image-placeholder">
                                <span>🖥️</span>
                              </div>
                            )}
                          </div>
                          <div className="project-content">
                            <h3>{project.title}</h3>
                            <span className="project-category">
                              {project.category}
                            </span>
                            <p>{project.description}</p>
                            <div className="project-technologies">
                              {project.technologies.map((tech, index) => (
                                <span key={index} className="tech-tag">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="project-links">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="project-link"
                                >
                                  Live Demo
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="project-link"
                                >
                                  GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="reviews-tab">
                    <div className="reviews-summary">
                      <div className="average-rating">
                        <div className="rating-score">{profile.rating}</div>
                        <div className="rating-stars">
                          {renderStars(profile.rating)}
                        </div>
                        <div className="rating-count">
                          {profile.reviews.length} reviews
                        </div>
                      </div>
                    </div>
                    <div className="reviews-list">
                      {profile.reviews.map((review) => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <strong>{review.clientName}</strong>
                              <span className="review-project">
                                {review.project}
                              </span>
                            </div>
                            <div className="review-rating">
                              {renderStars(review.rating)}
                              <span className="review-date">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="modal-overlay">
          <div className="contact-modal">
            <div className="modal-header">
              <h3>Contact {profile.name}</h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="contact-form">
              <div className="form-group">
                <label>Project Description</label>
                <textarea
                  placeholder="Describe your project requirements, timeline, and budget..."
                  rows={5}
                  required
                />
              </div>
              <div className="form-group">
                <label>Budget Range</label>
                <select required>
                  <option value="">Select budget range</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <select required>
                  <option value="">Select timeline</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="2+ months">2+ months</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="secondary-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerProfileView;
