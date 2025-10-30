import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const FreelancerDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Completed Projects", value: "12", icon: "✅" },
    { label: "Active Projects", value: "3", icon: "🔄" },
    { label: "Total Earnings", value: "$8,450", icon: "💰" },
    { label: "Client Reviews", value: "4.9/5", icon: "⭐" },
  ];

  const recentProjects = [
    {
      name: "E-commerce Website",
      client: "Tech Corp",
      status: "Completed",
      earnings: "$2,500",
    },
    {
      name: "Mobile App UI",
      client: "Startup XYZ",
      status: "In Progress",
      earnings: "$1,800",
    },
    {
      name: "Brand Identity",
      client: "Local Business",
      status: "Completed",
      earnings: "$1,200",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's what's happening with your freelance business today</p>
        </div>
        <div className="header-actions">
          <Link to="/portfolio" className="primary-btn">
            Update Portfolio
          </Link>
          <button className="secondary-btn">Find New Projects</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <Link to="/projects" className="view-all-link">
              View All
            </Link>
          </div>
          <div className="projects-list">
            {recentProjects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-info">
                  <h4>{project.name}</h4>
                  <p>Client: {project.client}</p>
                </div>
                <div className="project-meta">
                  <span
                    className={`status ${project.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {project.status}
                  </span>
                  <span className="earnings">{project.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <div className="action-text">Update Profile</div>
            </Link>
            <Link to="/portfolio" className="action-card">
              <div className="action-icon">💼</div>
              <div className="action-text">Manage Portfolio</div>
            </Link>
            <Link to="/messages" className="action-card">
              <div className="action-icon">💬</div>
              <div className="action-text">Messages</div>
            </Link>
            <Link to="/earnings" className="action-card">
              <div className="action-icon">💰</div>
              <div className="action-text">View Earnings</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
