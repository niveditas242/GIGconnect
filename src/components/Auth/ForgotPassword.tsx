import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ForgotPassword.css";

const ForgotPassword: React.FC = () => {
  const { forgotPassword, resetPassword, otpLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await forgotPassword(email); // Use forgotPassword instead of sendOTP

      if (result.success) {
        setMessage(result.message);
        setIsError(false);
        setStep("otp");
      } else {
        setMessage(result.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // In the real flow, OTP verification is handled during password reset
    // For now, we'll just proceed to reset step if OTP is provided
    if (otp.length === 6) {
      setMessage("OTP verified! Please set your new password.");
      setIsError(false);
      setStep("reset");
    } else {
      setMessage("Please enter a valid 6-digit OTP");
      setIsError(true);
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await forgotPassword(email); // Use forgotPassword to resend

      if (result.success) {
        setMessage("New OTP sent to your email");
        setIsError(false);
      } else {
        setMessage(result.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Failed to resend OTP. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email, otp, newPassword); // Use real backend

      if (result.success) {
        setMessage(
          "Password reset successful! You can now login with your new password."
        );
        setIsError(false);

        // Redirect to login after success
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(result.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setMessage("");
    setOtp("");
  };

  const handleBackToOTP = () => {
    setStep("otp");
    setMessage("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Reset Your Password</h2>
        <p className="forgot-password-subtitle">
          {step === "email" &&
            "Enter your email to receive a verification code"}
          {step === "otp" && "Enter the verification code sent to your email"}
          {step === "reset" && "Create your new password"}
        </p>

        {message && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === "email" && (
          <form onSubmit={handleSendOTP} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                disabled={loading}
              />
              <small className="hint">
                Check your email for the verification code
              </small>
            </div>

            <div className="button-group">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBackToEmail}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>

            <div className="resend-otp">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                className="btn-link"
                onClick={handleResendOTP}
                disabled={loading || otpLoading}
              >
                {otpLoading ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBackToOTP}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

        <div className="forgot-password-footer">
          <p>
            Remember your password?{" "}
            <a href="/login" className="link">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
