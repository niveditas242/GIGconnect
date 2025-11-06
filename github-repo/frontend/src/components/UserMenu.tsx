// components/UserMenu.tsx - Portfolio for all users
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./UserMenu.css";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="auth-links">
        <button onClick={() => navigate("/login")} className="nav-auth-link">
          Log In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="nav-auth-link signup"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="user-links">
      {/* Portfolio link for ALL users */}
      <button
        onClick={() => navigate("/portfolio")}
        className="nav-portfolio-link"
      >
        Create Portfolio
      </button>

      {/* Dashboard link */}
      <button onClick={handleDashboard} className="nav-dashboard-link">
        Dashboard
      </button>

      {/* User info and logout */}
      <span className="user-greeting">Welcome, {user.name.split(" ")[0]}</span>
      <button onClick={handleLogout} className="nav-auth-link logout">
        Logout
      </button>
    </div>
  );
};

export default UserMenu;
