import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./FreelancerDashboard.css"; // We'll create this CSS file

const FreelancerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Dynamic greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    { label: "Completed Projects", value: "12", icon: "✅", color: "#10B981" },
    { label: "Active Projects", value: "3", icon: "🔄", color: "#3B82F6" },
    { label: "Total Earnings", value: "$8,450", icon: "💰", color: "#F59E0B" },
    { label: "Client Reviews", value: "4.9/5", icon: "⭐", color: "#8B5CF6" },
  ];

  const recentProjects = [
    {
      name: "E-commerce Website",
      client: "Tech Corp",
      status: "Completed",
      earnings: "$2,500",
      statusColor: "#10B981",
    },
    {
      name: "Mobile App UI",
      client: "Startup XYZ",
      status: "In Progress",
      earnings: "$1,800",
      statusColor: "#3B82F6",
    },
    {
      name: "Brand Identity",
      client: "Local Business",
      status: "Completed",
      earnings: "$1,200",
      statusColor: "#10B981",
    },
  ];

  const quickActions = [
    { icon: "👤", label: "Update Profile", link: "/profile", color: "#EC4899" },
    {
      icon: "💼",
      label: "Manage Portfolio",
      link: "/portfolio",
      color: "#8B5CF6",
    },
    { icon: "💬", label: "Messages", link: "/messages", color: "#06B6D4" },
    { icon: "💰", label: "View Earnings", link: "/earnings", color: "#F59E0B" },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section with Animation */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="greeting-container">
            <h1 className="greeting-text">
              {getTimeBasedGreeting()},{" "}
              <span className="user-name">{user?.name}!</span> 👋
            </h1>
            <p className="welcome-subtitle">
              Ready to make today amazing? Let's check your progress!
            </p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/portfolio" className="primary-btn btn-hover">
            <span className="btn-icon">🎨</span>
            Update Portfolio
          </Link>
          <button className="secondary-btn btn-hover">
            <span className="btn-icon">🔍</span>
            Find New Projects
          </button>
          <button onClick={logout} className="logout-btn btn-hover">
            <span className="btn-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid with Animation */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className="stat-icon"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Recent Projects Section */}
        <div className="dashboard-section slide-in">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <Link to="/projects" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="projects-list">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="project-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-info">
                  <h4 className="project-name">{project.name}</h4>
                  <p className="project-client">Client: {project.client}</p>
                </div>
                <div className="project-meta">
                  <span
                    className="project-status"
                    style={{
                      backgroundColor: `${project.statusColor}20`,
                      color: project.statusColor,
                    }}
                  >
                    {project.status}
                  </span>
                  <span className="project-earnings">{project.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="dashboard-section slide-in">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="action-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  borderLeft: `4px solid ${action.color}`,
                }}
              >
                <div
                  className="action-icon"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  {action.icon}
                </div>
                <div className="action-text">{action.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
