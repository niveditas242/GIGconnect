import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Auth.css";

interface OTPVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationComplete,
  onBack,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { verifyOTP, resendOTP, otpLoading } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    startCountdown();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(60); // 60 seconds countdown
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      // Focus the last input
      const lastInput = inputRefs.current[5];
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(email, otpString);

      if (result.success) {
        toast.success("Email verified successfully! 🎉");
        onVerificationComplete();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    try {
      const result = await resendOTP(email);
      if (result.success) {
        toast.success("New OTP sent to your email");
        startCountdown();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button onClick={onBack} className="back-button" type="button">
            ← Back
          </button>
          <h1>Verify Your Email</h1>
          <p>We've sent a 6-digit code to {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-container">
            <label>Enter OTP Code</label>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="otp-input"
                  disabled={isLoading || otpLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading || otpLoading}
          >
            {isLoading || otpLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="otp-footer">
          <p>
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              className={`resend-button ${countdown > 0 ? "disabled" : ""}`}
              disabled={countdown > 0 || otpLoading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </p>
        </div>

        <div className="demo-info">
          <h3>Demo Information</h3>
          <p>Check the browser console for the OTP code</p>
          <p>Any 6-digit number will work for demo purposes</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
