import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext, { useAuth } from "../context/AuthContext";

interface VerifyEmailProps {
  userId?: string;
  token?: string;
  onVerified?: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ userId, token, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth(); // available if needed

  const handleVerify = async () => {
    if (!otp || (!userId && !token)) {
      setMessage("Missing OTP or identifier");
      return;
    }
    setLoading(true);
    try {
      const payload: any = { otp };
      if (userId) payload.userId = userId;
      if (token) payload.token = token;

      const res = await axios.post("/auth/verify-email", payload);
      const data = res.data;
      setMessage(data?.message || "Verified successfully");

      if (data?.success && onVerified) onVerified();

      // Optional: if backend returns user/token, update auth context
      if (data?.user) {
        try {
          // If your AuthContext exposes a setter via login-like response, adapt as needed.
          // Example: auth.login could accept token/email — adapt to your implementation.
        } catch {}
      }
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
