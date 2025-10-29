import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css"

// import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    // TODO: API call here
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Join GIGconnect today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />

          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="auth-select"
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
