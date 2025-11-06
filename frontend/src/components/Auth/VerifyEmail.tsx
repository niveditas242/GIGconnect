import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface VerifyEmailProps {
  userId: string;
  onVerified?: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ userId, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth(); // optional use of context if needed

  const handleVerify = async () => {
    if (!otp) {
      setMessage("Enter OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/auth/verify-email", { userId, otp });
      setMessage(res.data?.message || "Verified");
      if (res.data?.success && onVerified) onVerified();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded mb-4"
      />
      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
};

export default VerifyEmail;
