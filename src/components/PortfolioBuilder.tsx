// src/components/PortfolioBuilder.tsx
import React, { useState } from "react";
import "./PortfolioBuilder.css";
import { BaseComponentProps } from "../types";

interface PortfolioData {
  profile: {
    name: string;
    title: string;
    bio: string;
    location: string;
    hourlyRate: string;
  };
  skills: string[];
  projects: any[];
  experience: any[];
}

interface AiSuggestions {
  profile: string;
  skills: string[];
  projects: any[];
}

const PortfolioBuilder: React.FC<BaseComponentProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    profile: {
      name: "",
      title: "",
      bio: "",
      location: "",
      hourlyRate: "",
    },
    skills: [],
    projects: [],
    experience: [],
  });

  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestions>({
    profile: "",
    skills: [],
    projects: [],
  });

  // AI Functions
  const generateAIBio = () => {
    // AI generates professional bio based on skills and experience
    const aiBio = `Experienced ${portfolioData.profile.title} with proven track record in delivering high-quality projects. Skilled in modern technologies and passionate about creating innovative solutions.`;
    setPortfolioData((prev) => ({
      ...prev,
      profile: { ...prev.profile, bio: aiBio },
    }));
  };

  const suggestSkills = () => {
    // AI suggests relevant skills based on profile
    const suggestedSkills = [
      "React",
      "Node.js",
      "TypeScript",
      "UI/UX Design",
      "Project Management",
    ];
    setAiSuggestions((prev) => ({
      ...prev,
      skills: suggestedSkills,
    }));
  };

  const optimizePortfolio = () => {
    // AI analyzes and provides optimization tips
    alert("AI is analyzing your portfolio for improvements...");
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !portfolioData.skills.includes(skill.trim())) {
      setPortfolioData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  return (
    <div className="portfolio-builder" id={id}>
      <div className="builder-header">
        <h1>AI-Powered Portfolio Builder</h1>
        <p>Let AI help you create a stunning portfolio that gets you hired</p>
      </div>

      <div className="builder-container">
        {/* AI Assistant Sidebar */}
        <div className="ai-sidebar">
          <div className="ai-assistant">
            <h3>🤖 AI Assistant</h3>
            <div className="ai-actions">
              <button onClick={generateAIBio} className="ai-btn">
                ✨ Generate Bio
              </button>
              <button onClick={suggestSkills} className="ai-btn">
                🎯 Suggest Skills
              </button>
              <button onClick={optimizePortfolio} className="ai-btn">
                📊 Optimize Portfolio
              </button>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.skills.length > 0 && (
              <div className="ai-suggestions">
                <h4>Suggested Skills:</h4>
                {aiSuggestions.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Builder Area */}
        <div className="builder-main">
          <div className="builder-tabs">
            <button
              className={activeTab === "profile" ? "tab active" : "tab"}
              onClick={() => setActiveTab("profile")}
            >
              👤 Profile
            </button>
            <button
              className={activeTab === "skills" ? "tab active" : "tab"}
              onClick={() => setActiveTab("skills")}
            >
              💼 Skills
            </button>
            <button
              className={activeTab === "projects" ? "tab active" : "tab"}
              onClick={() => setActiveTab("projects")}
            >
              🚀 Projects
            </button>
            <button
              className={activeTab === "preview" ? "tab active" : "tab"}
              onClick={() => setActiveTab("preview")}
            >
              👀 Preview
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "profile" && (
              <div className="profile-tab">
                <h3>Professional Profile</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={portfolioData.profile.name}
                    onChange={(e) =>
                      setPortfolioData((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Frontend Developer"
                    value={portfolioData.profile.title}
                    onChange={(e) =>
                      setPortfolioData((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, title: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    placeholder="Tell clients about yourself..."
                    value={portfolioData.profile.bio}
                    onChange={(e) =>
                      setPortfolioData((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, bio: e.target.value },
                      }))
                    }
                  ></textarea>
                  <button onClick={generateAIBio} className="ai-help-btn">
                    🤖 AI Write Bio
                  </button>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="skills-tab">
                <h3>Skills & Expertise</h3>
                <div className="skills-input">
                  <input
                    type="text"
                    placeholder="Add skills (e.g., React, UI/UX)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addSkill((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector(
                        ".skills-input input"
                      ) as HTMLInputElement;
                      if (input) {
                        addSkill(input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add Skill
                  </button>
                </div>
                <button onClick={suggestSkills} className="ai-help-btn">
                  🎯 AI Suggest Skills
                </button>
                <div className="current-skills">
                  {portfolioData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="projects-tab">
                <h3>Project Portfolio</h3>
                <button className="add-project-btn">➕ Add Project</button>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="preview-tab">
                <h3>Portfolio Preview</h3>
                <button onClick={optimizePortfolio} className="ai-help-btn">
                  📊 AI Portfolio Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
