// src/components/PortfolioBuilder.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
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

  // Check if portfolio has content
  const hasContent = () => {
    return (
      portfolio.name.trim() !== "" ||
      portfolio.title.trim() !== "" ||
      portfolio.bio.trim() !== "" ||
      portfolio.skills.length > 0 ||
      portfolio.projects.length > 0
    );
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // Convert image to base64 for preview
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

  // Publish Portfolio to Backend
  const publishPortfolio = async () => {
    if (!hasContent()) {
      toast.error(
        "Please add some content to your portfolio before publishing."
      );
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/portfolio/publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...portfolio,
            profilePhoto: portfolio.profilePhoto, // Include profile photo in the data
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsPublished(true);
        toast.success(
          "🎉 Portfolio published successfully! You are now visible to clients."
        );
      } else {
        toast.error(data.message || "Failed to publish portfolio");
      }
    } catch (error: any) {
      console.error("Publish portfolio error:", error);
      toast.error("Failed to publish portfolio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save Portfolio to Backend
  const savePortfolio = async () => {
    if (!hasContent()) {
      toast.error("Please add some content to your portfolio before saving.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Save portfolio data including profile photo
      const response = await fetch("http://localhost:5000/api/portfolio/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...portfolio,
          profilePhoto: portfolio.profilePhoto,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save portfolio");
      }

      toast.success("💾 Portfolio saved successfully!");
    } catch (error: any) {
      console.error("Save portfolio error:", error);
      toast.error("Failed to save portfolio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Download portfolio as PDF using html2canvas and jsPDF
  const downloadPortfolio = async () => {
    if (!hasContent()) {
      toast.error(
        "Please add some content to your portfolio before downloading."
      );
      return;
    }

    try {
      // Dynamically import the libraries
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Get the preview element
      const previewElement = document.querySelector(
        ".portfolio-preview"
      ) as HTMLElement;

      if (!previewElement) {
        toast.error("Could not find portfolio preview.");
        return;
      }

      // Create canvas from the preview
      const canvas = await html2canvas(previewElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`portfolio-${portfolio.name || "my-portfolio"}.pdf`);
      toast.success("📄 Portfolio downloaded as PDF!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF. Please try again.");

      // Fallback: Use print method
      const printContent = createPrintContent();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  };

  // Helper function to create print content (fallback)
  const createPrintContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Portfolio - ${portfolio.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #1a202c;
      background: #ffffff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
    }
    
    .profile-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 20px;
    }
    
    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #6366f1;
    }
    
    .profile-text h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #0d2438;
      margin-bottom: 10px;
    }
    
    .profile-text .title {
      font-size: 1.3rem;
      color: #6366f1;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .contact-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 15px;
      font-size: 0.9rem;
      color: #4a5568;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #0d2438;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .bio {
      font-size: 1rem;
      color: #4a5568;
      text-align: justify;
      line-height: 1.8;
    }
    
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    
    .skill-tag {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .project {
      margin-bottom: 25px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #f7fafc;
      page-break-inside: avoid;
    }
    
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    
    .project-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2d3748;
    }
    
    .project-category {
      background: #6366f1;
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: capitalize;
    }
    
    .project-description {
      color: #4a5568;
      margin: 10px 0;
      line-height: 1.6;
    }
    
    .project-links {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }
    
    .project-link {
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 10px;
    }
    
    .info-item {
      margin-bottom: 10px;
    }
    
    .info-label {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 5px;
    }
    
    .info-value {
      color: #4a5568;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      color: #718096;
      font-size: 0.9rem;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="profile-header">
      ${
        portfolio.profilePhoto
          ? `<img src="${portfolio.profilePhoto}" class="profile-avatar" alt="${portfolio.name}">`
          : ""
      }
      <div class="profile-text">
        <h1>${portfolio.name || "Professional Portfolio"}</h1>
        <div class="title">${portfolio.title || "Professional"}</div>
      </div>
    </div>
    <div class="contact-info">
      ${portfolio.email ? `<div>📧 ${portfolio.email}</div>` : ""}
      ${portfolio.phone ? `<div>📞 ${portfolio.phone}</div>` : ""}
      ${portfolio.location ? `<div>📍 ${portfolio.location}</div>` : ""}
    </div>
  </div>

  ${
    portfolio.bio
      ? `
  <div class="section">
    <h2>Professional Summary</h2>
    <div class="bio">${portfolio.bio}</div>
  </div>
  `
      : ""
  }

  <div class="info-grid">
    ${
      portfolio.experience
        ? `
    <div class="info-item">
      <div class="info-label">Experience</div>
      <div class="info-value">${portfolio.experience} years</div>
    </div>
    `
        : ""
    }
    
    ${
      portfolio.education
        ? `
    <div class="info-item">
      <div class="info-label">Education</div>
      <div class="info-value">${portfolio.education}</div>
    </div>
    `
        : ""
    }
  </div>

  ${
    portfolio.skills.length > 0
      ? `
  <div class="section">
    <h2>Skills & Technologies</h2>
    <div class="skills-container">
      ${portfolio.skills
        .map((skill) => `<span class="skill-tag">${skill}</span>`)
        .join("")}
    </div>
  </div>
  `
      : ""
  }

  ${
    portfolio.projects.length > 0
      ? `
  <div class="section">
    <h2>Projects (${portfolio.projects.length})</h2>
    ${portfolio.projects
      .map(
        (project) => `
      <div class="project">
        <div class="project-header">
          <div class="project-title">${project.title}</div>
          <span class="project-category">${project.category}</span>
        </div>
        <div class="project-description">${project.description}</div>
        ${
          project.liveUrl || project.githubUrl
            ? `
        <div class="project-links">
          ${
            project.liveUrl
              ? `<a href="${project.liveUrl}" class="project-link">Live Demo</a>`
              : ""
          }
          ${
            project.githubUrl
              ? `<a href="${project.githubUrl}" class="project-link">GitHub</a>`
              : ""
          }
        </div>
        `
            : ""
        }
      </div>
    `
      )
      .join("")}
  </div>
  `
      : ""
  }

  <div class="footer">
    <p>Generated by GIGconnect • ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
  </div>
</body>
</html>`;
  };

  // Add skill
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

  // Remove skill
  const removeSkill = (skill: string) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Add project
  const addProject = () => {
    if (currentProject.title && currentProject.description) {
      const newProject: Project = {
        id: Date.now().toString(),
        title: currentProject.title || "",
        description: currentProject.description || "",
        image: currentProject.image || "",
        technologies: currentProject.technologies || [],
        category: currentProject.category || "web-development",
        liveUrl: currentProject.liveUrl,
        githubUrl: currentProject.githubUrl,
      };

      setPortfolio((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
      }));

      setCurrentProject({
        title: "",
        description: "",
        image: "",
        technologies: [],
        category: "web-development",
      });

      toast.success("✅ Project added successfully!");
    } else {
      toast.error("Please fill in project title and description");
    }
  };

  // Remove project
  const removeProject = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
    toast.info("🗑️ Project removed");
  };

  return (
    <div className="portfolio-builder">
      <div className="portfolio-hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Build Your Professional Portfolio</h1>
            <p>
              Showcase your skills and projects to attract clients worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="portfolio-container">
        <div className="portfolio-content">
          <div className="portfolio-layout">
            {/* Form Section */}
            <div className="form-section">
              {/* Personal Information */}
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

              {/* Rest of the component remains the same... */}
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
              <section className="portfolio-form-section">
                <h2>Add Projects</h2>

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
                    <span className="btn-icon">+</span>
                    Add Project to Portfolio
                  </button>
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
                            onClick={() => {
                              // Set current project for editing
                              setCurrentProject(project);
                              // Remove from list since we're editing
                              removeProject(project.id);
                            }}
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
                  onClick={savePortfolio}
                  className="save-portfolio-btn"
                  disabled={!hasContent() || isLoading}
                >
                  <span className="btn-icon">💾</span>
                  {isLoading ? "Saving..." : "Save Portfolio"}
                </button>

                <button
                  onClick={downloadPortfolio}
                  className="download-portfolio-btn"
                  disabled={!hasContent()}
                >
                  <span className="btn-icon">📄</span>
                  Download as PDF
                </button>

                <button
                  onClick={publishPortfolio}
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
