// src/components/PortfolioBuilder.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  savePortfolio,
  getMyPortfolio,
  publishPortfolio,
  deletePortfolio,
} from "../services/api";
import "./PortfolioBuilder.css";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
}

interface PortfolioData {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
  skills: string[];
  projects: Project[];
  profilePhoto: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isPublished?: boolean;
}

const PortfolioBuilder: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    name: user?.name || "",
    title: user?.title || "",
    bio: user?.bio || "",
    email: user?.email || "",
    phone: "",
    location: "",
    experience: "",
    education: "",
    skills: user?.skills || [],
    projects: [],
    profilePhoto: "",
    socialLinks: {},
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    image: "",
    technologies: [],
    category: "web-development",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [hasExistingPortfolio, setHasExistingPortfolio] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState<string | null>(null);

  // Load portfolio data when component mounts
  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Load existing portfolio data
  const loadPortfolioData = async () => {
    try {
      setIsLoading(true);
      const response = await getMyPortfolio();

      if (response.success && response.portfolio) {
        setPortfolio(response.portfolio);
        setIsPublished(response.portfolio.isPublished || false);
        setHasExistingPortfolio(true);
        toast.info("📁 Your existing portfolio has been loaded");
      }
    } catch (error: any) {
      console.log(
        "No existing portfolio found or error loading:",
        error.message
      );
      // It's okay if no portfolio exists yet
    } finally {
      setIsLoading(false);
    }
  };

  // Check if portfolio has content
  const hasContent = () => {
    return (
      portfolio.name.trim() !== "" &&
      portfolio.title.trim() !== "" &&
      portfolio.projects.length > 0
    );
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPortfolio((prev) => ({
          ...prev,
          profilePhoto: base64String,
        }));
        setIsUploadingPhoto(false);
        toast.success("Profile photo uploaded successfully!");
      };
      reader.onerror = () => {
        setIsUploadingPhoto(false);
        toast.error("Failed to upload profile photo");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploadingPhoto(false);
      toast.error("Failed to upload profile photo");
    }
  };

  // Remove profile photo
  const removeProfilePhoto = () => {
    setPortfolio((prev) => ({
      ...prev,
      profilePhoto: "",
    }));
    toast.info("Profile photo removed");
  };

  // SAVE PORTFOLIO - Create or Update
  const handleSavePortfolio = async () => {
    if (!hasContent()) {
      toast.error(
        "Please add name, title, and at least one project before saving."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await savePortfolio(portfolio);

      if (response.success) {
        setHasExistingPortfolio(true);
        toast.success(
          hasExistingPortfolio
            ? "💾 Portfolio updated successfully!"
            : "💾 Portfolio saved successfully!"
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Save portfolio error:", error);
      toast.error(
        error.message || "Failed to save portfolio. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // PUBLISH PORTFOLIO
  const handlePublishPortfolio = async () => {
    if (!hasContent()) {
      toast.error(
        "Please complete your portfolio (name, title, and at least one project) before publishing."
      );
      return;
    }

    // First save the portfolio, then publish
    setIsLoading(true);
    try {
      // Save first to ensure all data is current
      await savePortfolio(portfolio);

      // Then publish
      const response = await publishPortfolio();

      if (response.success) {
        setIsPublished(true);
        setHasExistingPortfolio(true);
        toast.success(
          "🎉 Portfolio published successfully! You are now visible to clients."
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Publish portfolio error:", error);
      toast.error(
        error.message || "Failed to publish portfolio. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE PORTFOLIO
  const handleDeletePortfolio = async () => {
    if (!hasExistingPortfolio) {
      toast.info("No portfolio to delete");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete your entire portfolio? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deletePortfolio();

      if (response.success) {
        // Reset to initial state
        setPortfolio({
          name: user?.name || "",
          title: user?.title || "",
          bio: user?.bio || "",
          email: user?.email || "",
          phone: "",
          location: "",
          experience: "",
          education: "",
          skills: user?.skills || [],
          projects: [],
          profilePhoto: "",
          socialLinks: {},
        });
        setIsPublished(false);
        setHasExistingPortfolio(false);
        setCurrentProject({
          title: "",
          description: "",
          image: "",
          technologies: [],
          category: "web-development",
        });
        toast.success("🗑️ Portfolio deleted successfully!");
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Delete portfolio error:", error);
      toast.error(
        error.message || "Failed to delete portfolio. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // DOWNLOAD PORTFOLIO AS PDF
  const handleDownloadPortfolio = async () => {
    if (!hasContent()) {
      toast.error(
        "Please add some content to your portfolio before downloading."
      );
      return;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const previewElement = document.querySelector(
        ".portfolio-preview"
      ) as HTMLElement;

      if (!previewElement) {
        toast.error("Could not find portfolio preview.");
        return;
      }

      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`portfolio-${portfolio.name || "my-portfolio"}.pdf`);
      toast.success("📄 Portfolio downloaded as PDF!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  // SKILL OPERATIONS
  const addSkill = () => {
    if (
      currentSkill.trim() &&
      !portfolio.skills.includes(currentSkill.trim())
    ) {
      setPortfolio((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // PROJECT OPERATIONS
  const addProject = () => {
    if (currentProject.title && currentProject.description) {
      const newProject: Project = {
        id: isEditingProject || Date.now().toString(),
        title: currentProject.title || "",
        description: currentProject.description || "",
        image: currentProject.image || "",
        technologies: currentProject.technologies || [],
        category: currentProject.category || "web-development",
        liveUrl: currentProject.liveUrl,
        githubUrl: currentProject.githubUrl,
      };

      if (isEditingProject) {
        // Update existing project
        setPortfolio((prev) => ({
          ...prev,
          projects: prev.projects.map((project) =>
            project.id === isEditingProject ? newProject : project
          ),
        }));
        toast.success("✅ Project updated successfully!");
      } else {
        // Add new project
        setPortfolio((prev) => ({
          ...prev,
          projects: [...prev.projects, newProject],
        }));
        toast.success("✅ Project added successfully!");
      }

      // Reset form
      setCurrentProject({
        title: "",
        description: "",
        image: "",
        technologies: [],
        category: "web-development",
      });
      setIsEditingProject(null);
    } else {
      toast.error("Please fill in project title and description");
    }
  };

  const editProject = (project: Project) => {
    setCurrentProject(project);
    setIsEditingProject(project.id);
    // Scroll to project form
    document
      .getElementById("project-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const removeProject = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
    toast.info("🗑️ Project removed");

    // If editing this project, clear the form
    if (isEditingProject === id) {
      setCurrentProject({
        title: "",
        description: "",
        image: "",
        technologies: [],
        category: "web-development",
      });
      setIsEditingProject(null);
    }
  };

  // RESET PORTFOLIO (Keep basic user info)
  const handleResetForm = () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all form data? This will clear all your current changes."
      )
    ) {
      return;
    }

    setPortfolio({
      name: user?.name || "",
      title: user?.title || "",
      bio: "",
      email: user?.email || "",
      phone: "",
      location: "",
      experience: "",
      education: "",
      skills: [],
      projects: [],
      profilePhoto: "",
      socialLinks: {},
    });
    setCurrentProject({
      title: "",
      description: "",
      image: "",
      technologies: [],
      category: "web-development",
    });
    setIsEditingProject(null);
    toast.info("🔄 Form reset successfully");
  };

  return (
    <div className="portfolio-builder">
      <div className="portfolio-hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Build Your Professional Portfolio</h1>
            <p>
              {hasExistingPortfolio
                ? "Edit and manage your existing portfolio"
                : "Showcase your skills and projects to attract clients worldwide"}
            </p>
            {hasExistingPortfolio && (
              <div className="portfolio-status">
                <span
                  className={`status-badge ${
                    isPublished ? "published" : "draft"
                  }`}
                >
                  {isPublished ? "📢 Published" : "📝 Draft"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="portfolio-container">
        <div className="portfolio-content">
          <div className="portfolio-layout">
            {/* Form Section */}
            <div className="form-section">
              {/* Portfolio Management Header */}
              <div className="portfolio-management-header">
                <h2>
                  {hasExistingPortfolio
                    ? "Edit Portfolio"
                    : "Create New Portfolio"}
                </h2>
                <div className="portfolio-actions-top">
                  {hasExistingPortfolio && (
                    <button
                      onClick={handleResetForm}
                      className="reset-form-btn"
                      disabled={isLoading}
                    >
                      🔄 Reset Form
                    </button>
                  )}
                  {hasExistingPortfolio && (
                    <button
                      onClick={handleDeletePortfolio}
                      className="delete-portfolio-btn"
                      disabled={isLoading}
                    >
                      🗑️ Delete Portfolio
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Information Section */}
              <section className="portfolio-form-section">
                <h2>Personal Information</h2>

                {/* Profile Photo Upload */}
                <div className="profile-photo-section">
                  <div className="profile-photo-container">
                    {portfolio.profilePhoto ? (
                      <div className="profile-photo-preview">
                        <img
                          src={portfolio.profilePhoto}
                          alt="Profile"
                          className="profile-photo"
                        />
                        <button
                          onClick={removeProfilePhoto}
                          className="remove-photo-btn"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="profile-photo-placeholder">
                        <div className="placeholder-icon">👤</div>
                        <p>No photo uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="photo-upload-actions">
                    <input
                      type="file"
                      id="profile-photo"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="photo-input"
                      disabled={isUploadingPhoto}
                    />
                    <label htmlFor="profile-photo" className="photo-upload-btn">
                      {isUploadingPhoto
                        ? "📤 Uploading..."
                        : "📷 Upload Profile Photo"}
                    </label>
                    <p className="photo-upload-hint">
                      Recommended: Square image, max 5MB
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={portfolio.name}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Professional Title *</label>
                    <input
                      type="text"
                      value={portfolio.title}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g., Frontend Developer, UX Designer"
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={portfolio.location}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={portfolio.email}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={portfolio.phone}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="form-group">
                    <label>Years of Experience</label>
                    <select
                      value={portfolio.experience}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          experience: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Education</label>
                    <input
                      type="text"
                      value={portfolio.education}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          education: e.target.value,
                        }))
                      }
                      placeholder="Degree or Certification"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Professional Bio *</label>
                    <textarea
                      value={portfolio.bio}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell us about your experience, expertise, and what makes you unique..."
                      rows={4}
                    />
                  </div>
                </div>
              </section>

              {/* Skills Section */}
              <section className="portfolio-form-section">
                <h2>Skills & Technologies</h2>
                <div className="skills-input-group">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add a skill (e.g., React, Python, UI/UX Design)"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="skill-input"
                  />
                  <button onClick={addSkill} className="skill-add-btn">
                    <span className="btn-icon">+</span>
                    Add Skill
                  </button>
                </div>

                <div className="skills-tags-container">
                  {portfolio.skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="skill-remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {portfolio.skills.length === 0 && (
                    <div className="no-skills-message">
                      No skills added yet. Add your first skill above!
                    </div>
                  )}
                </div>
              </section>

              {/* Projects Section */}
              <section className="portfolio-form-section" id="project-form">
                <h2>{isEditingProject ? "Edit Project" : "Add Projects"}</h2>

                <div className="project-input-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Project Title *</label>
                      <input
                        type="text"
                        value={currentProject.title}
                        onChange={(e) =>
                          setCurrentProject((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter project name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={currentProject.category}
                        onChange={(e) =>
                          setCurrentProject((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                      >
                        <option value="web-development">Web Development</option>
                        <option value="mobile-app">Mobile App</option>
                        <option value="ui-ux">UI/UX Design</option>
                        <option value="graphic-design">Graphic Design</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Project Description *</label>
                      <textarea
                        value={currentProject.description}
                        onChange={(e) =>
                          setCurrentProject((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe your project, technologies used, challenges solved, and your role..."
                        rows={4}
                      />
                    </div>

                    <div className="form-group">
                      <label>Live Demo URL</label>
                      <input
                        type="url"
                        value={currentProject.liveUrl}
                        onChange={(e) =>
                          setCurrentProject((prev) => ({
                            ...prev,
                            liveUrl: e.target.value,
                          }))
                        }
                        placeholder="https://your-project.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>GitHub URL</label>
                      <input
                        type="url"
                        value={currentProject.githubUrl}
                        onChange={(e) =>
                          setCurrentProject((prev) => ({
                            ...prev,
                            githubUrl: e.target.value,
                          }))
                        }
                        placeholder="https://github.com/your-repo"
                      />
                    </div>
                  </div>

                  <button onClick={addProject} className="project-add-btn">
                    <span className="btn-icon">
                      {isEditingProject ? "✏️" : "+"}
                    </span>
                    {isEditingProject
                      ? "Update Project"
                      : "Add Project to Portfolio"}
                  </button>

                  {isEditingProject && (
                    <button
                      onClick={() => {
                        setCurrentProject({
                          title: "",
                          description: "",
                          image: "",
                          technologies: [],
                          category: "web-development",
                        });
                        setIsEditingProject(null);
                      }}
                      className="cancel-edit-btn"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Projects List */}
                <div className="projects-preview">
                  <h3>Your Projects ({portfolio.projects.length})</h3>
                  {portfolio.projects.map((project) => (
                    <div key={project.id} className="project-preview-card">
                      <div className="project-preview-header">
                        <h4>{project.title}</h4>
                        <div className="project-actions">
                          <button
                            onClick={() => editProject(project)}
                            className="project-edit-btn"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => removeProject(project.id)}
                            className="project-remove-btn"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <span className="project-category-badge">
                        {project.category}
                      </span>
                      <p className="project-preview-description">
                        {project.description}
                      </p>
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
                  ))}
                  {portfolio.projects.length === 0 && (
                    <div className="no-projects-message">
                      No projects added yet. Add your first project above!
                    </div>
                  )}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="portfolio-actions">
                <button
                  onClick={handleSavePortfolio}
                  className="save-portfolio-btn"
                  disabled={!hasContent() || isLoading}
                >
                  <span className="btn-icon">💾</span>
                  {isLoading
                    ? "Saving..."
                    : hasExistingPortfolio
                    ? "Update Portfolio"
                    : "Save Portfolio"}
                </button>

                <button
                  onClick={handleDownloadPortfolio}
                  className="download-portfolio-btn"
                  disabled={!hasContent()}
                >
                  <span className="btn-icon">📄</span>
                  Download as PDF
                </button>

                <button
                  onClick={handlePublishPortfolio}
                  className="publish-portfolio-btn"
                  disabled={!hasContent() || isLoading || isPublished}
                >
                  <span className="btn-icon">🚀</span>
                  {isPublished
                    ? "Published!"
                    : isLoading
                    ? "Publishing..."
                    : "Publish Portfolio"}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="preview-section">
              <div className="preview-container">
                <h2>Portfolio Preview</h2>
                <div className="portfolio-preview">
                  <div className="preview-header">
                    <div className="preview-avatar">
                      {portfolio.profilePhoto ? (
                        <img
                          src={portfolio.profilePhoto}
                          alt={portfolio.name}
                          className="profile-photo-preview"
                        />
                      ) : (
                        <div className="avatar-fallback">
                          {portfolio.name
                            ? portfolio.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      )}
                    </div>
                    <div className="preview-personal-info">
                      <h3>{portfolio.name || "Your Name"}</h3>
                      <p className="preview-title">
                        {portfolio.title || "Your Professional Title"}
                      </p>
                      <p className="preview-location">
                        {portfolio.location || "Location"}
                      </p>
                    </div>
                  </div>

                  <div className="preview-bio">
                    <h4>About Me</h4>
                    <p>
                      {portfolio.bio ||
                        "Your professional bio will appear here..."}
                    </p>
                  </div>

                  {portfolio.experience && (
                    <div className="preview-experience">
                      <h4>Experience</h4>
                      <p>{portfolio.experience} years of experience</p>
                    </div>
                  )}

                  {portfolio.education && (
                    <div className="preview-education">
                      <h4>Education</h4>
                      <p>{portfolio.education}</p>
                    </div>
                  )}

                  {portfolio.skills.length > 0 && (
                    <div className="preview-skills">
                      <h4>Skills & Technologies</h4>
                      <div className="preview-skills-tags">
                        {portfolio.skills.map((skill, index) => (
                          <span key={index} className="preview-skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {portfolio.projects.length > 0 && (
                    <div className="preview-projects">
                      <h4>Projects ({portfolio.projects.length})</h4>
                      <div className="preview-projects-list">
                        {portfolio.projects.map((project) => (
                          <div
                            key={project.id}
                            className="preview-project-item"
                          >
                            <h5>{project.title}</h5>
                            <span className="preview-project-category">
                              {project.category}
                            </span>
                            <p>{project.description}</p>
                            <div className="preview-project-links">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="preview-link"
                                >
                                  Live Demo
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="preview-link"
                                >
                                  GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!hasContent() && (
                    <div className="preview-empty-state">
                      <p>
                        ✨ Start building your portfolio by filling out the
                        form!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
