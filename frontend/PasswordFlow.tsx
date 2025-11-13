// src/components/PasswordFlow.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Correct path from components folder
import { toast } from "react-toastify";
import "./PasswordFlow.css";

interface PasswordFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PasswordFlow: React.FC<PasswordFlowProps> = ({ onSuccess, onCancel }) => {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"current" | "new">("current");

  const handleCurrentPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error("Please enter your current password");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStep("new");
        toast.success("Current password verified");
      } else {
        toast.error(data.message || "Current password is incorrect");
      }
    } catch (error: any) {
      console.error("Password verification error:", error);
      toast.error("Failed to verify current password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Password changed successfully!");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="password-flow">
      <div className="password-flow-header">
        <h2>Change Password</h2>
        <p>Secure your account with a new password</p>
      </div>

      {step === "current" && (
        <form onSubmit={handleCurrentPasswordSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="password-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="continue-btn" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </div>
        </form>
      )}

      {step === "new" && (
        <form onSubmit={handleNewPasswordSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="password-requirements">
            <p>Password Requirements:</p>
            <ul>
              <li className={newPassword.length >= 6 ? "met" : ""}>
                At least 6 characters long
              </li>
              <li
                className={
                  newPassword === confirmPassword && newPassword !== ""
                    ? "met"
                    : ""
                }
              >
                Passwords match
              </li>
            </ul>
          </div>

          <div className="password-actions">
            <button
              type="button"
              onClick={() => setStep("current")}
              className="back-btn"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={
                isLoading ||
                newPassword !== confirmPassword ||
                newPassword.length < 6
              }
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordFlow;
