// frontend/src/components/Auth/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Auth.css";

const Register: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Basic info, 2: OTP verification, 3: Password
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOTP = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email) {
      toast.error("Please enter your name and email first");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔄 Sending OTP to:", formData.email);

      const result = await sendOTP(formData.email);
      console.log("🔄 OTP send result:", result);

      if (result.success) {
        setStep(2);
        toast.success("OTP sent to your email! 📧");
      } else {
        // This should not happen now since errors are thrown
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("❌ OTP send error:", error);

      const errorMessage = error?.message || "Failed to send OTP";

      // Check for email already registered error
      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("exists") ||
        errorMessage.toLowerCase().includes("registered")
      ) {
        toast.error(
          "📧 This email is already registered. Please use a different email address or try logging in."
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (formData.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔄 Verifying OTP:", formData.otp);
      const result = await verifyOTP(formData.email, formData.otp);

      if (result.success) {
        setStep(3);
        toast.success("Email verified successfully! ✅");
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error: any) {
      console.error("❌ OTP verify error:", error);
      toast.error(error?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔄 Registering user:", formData.email);

      const result = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        userType: "client",
      });

      if (result.success) {
        toast.success("Account created successfully! 🎉");
        navigate("/");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error);

      const errorMessage = error?.message || "Registration failed";

      // Handle email already exists error during registration
      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("exists") ||
        errorMessage.toLowerCase().includes("registered")
      ) {
        toast.error(
          "📧 This email is already registered. Please use a different email address."
        );
        setStep(1); // Go back to email entry step
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="form-steps">
      {[1, 2, 3].map((stepNumber) => (
        <div
          key={stepNumber}
          className={`step-dot ${step === stepNumber ? "active" : ""}`}
        />
      ))}
    </div>
  );

  // Step 1: Basic Information
  if (step === 1) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Join GIGconnect</h1>
            <p>Create your account to start your journey</p>
            <StepIndicator />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendOTP();
            }}
            className="auth-form"
          >
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="auth-input"
              />
            </div>

            <button
              type="submit"
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Continue to Verification"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: OTP Verification
  if (step === 2) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Verify Your Email</h1>
            <p>Enter the OTP sent to {formData.email}</p>
            <StepIndicator />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyOTP();
            }}
            className="auth-form"
          >
            <div className="form-group">
              <label htmlFor="otp">Verification Code *</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                disabled={isLoading}
                className="auth-input otp-input"
              />
            </div>

            <button
              type="submit"
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="resend-otp-btn"
              >
                Resend OTP
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Wrong email?{" "}
              <button
                onClick={() => setStep(1)}
                className="auth-link"
                type="button"
              >
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Password Setup Only
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Set Your Password</h1>
          <p>Create a secure password for your account</p>
          <StepIndicator />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min. 6 characters)"
              required
              disabled={isLoading}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Want to change something?{" "}
            <button
              onClick={() => setStep(1)}
              className="auth-link"
              type="button"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
