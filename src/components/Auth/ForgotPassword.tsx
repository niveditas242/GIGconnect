// frontend/src/components/Auth/ForgotPassword.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Auth.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔓 ForgotPassword: Sending reset email to", email);

      const result = await forgotPassword(email);
      console.log("🔓 ForgotPassword: Result", result);

      if (result.success) {
        setEmailSent(true);
        toast.success("Password reset code sent! 📧");
      } else {
        toast.error(result.message || "Failed to send reset code");
      }
    } catch (error: any) {
      console.error("❌ ForgotPassword error:", error);
      toast.error(
        error.message || "Failed to send reset code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">✅</div>
            <h1>Check Your Email</h1>
            <p>We've sent a password reset code to your email address.</p>
            <p className="email-display">{email}</p>
          </div>

          <div className="success-message">
            <p>Enter the 6-digit code on the reset password page.</p>
            <p className="note">
              If you don't see the email, check your spam folder.
            </p>

            {/* Development info */}
            <div className="otp-display">
              <p>
                <strong>Note:</strong> Check your backend console for the OTP
                code during development
              </p>
              <p className="note">(The code will expire in 10 minutes)</p>
            </div>
          </div>

          <div className="action-buttons">
            <Link
              to="/reset-password"
              state={{ email: email }}
              className="auth-button primary"
            >
              Enter Reset Code
            </Link>
            <Link
              to="/login"
              className="auth-button secondary"
              style={{ marginTop: "10px" }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="back-button">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
          <h1>Forgot Password?</h1>
          <p>
            Enter your email address and we'll send you a code to reset your
            password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="input-container">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email address"
                required
                disabled={isLoading}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
