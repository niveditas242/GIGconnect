// frontend/src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  sendOTP as apiSendOTP,
  verifyOTP as apiVerifyOTP,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  getCurrentUser,
  logout as apiLogout,
  isAuthenticated as apiIsAuthenticated,
  getCurrentUserFromStorage,
} from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  userType: "freelancer" | "client";
  skills?: string[];
  title?: string;
  bio?: string;
  isVerified: boolean;
  profileImage?: string;
  hourlyRate?: number;
  location?: string;
  experienceLevel?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  otpSent: boolean;
  otpVerified: boolean;
  otpLoading: boolean;
}

// Create context - ONLY ONCE
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (apiIsAuthenticated()) {
        try {
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.data);
            setIsAuthenticated(true);
          } else {
            apiLogout();
          }
        } catch (error) {
          console.error("Error verifying authentication:", error);
          apiLogout();
        }
      } else {
        const storedUser = getCurrentUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const sendOTP = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      console.log("🔄 Sending OTP to:", email);
      const result = await apiSendOTP(email);

      if (result.success) {
        setOtpSent(true);
        return {
          success: true,
          message: result.message || "OTP sent successfully",
        };
      } else {
        // FIX: Throw error instead of returning success: false
        throw new Error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("OTP send error:", error);
      // FIX: Re-throw the error so it can be caught in Register.tsx
      throw error;
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      console.log("🔄 Verifying OTP for:", email);
      const result = await apiVerifyOTP(email, otp);

      if (result.success) {
        setOtpVerified(true);
        return {
          success: true,
          message: result.message || "OTP verified successfully",
        };
      } else {
        throw new Error(result.message || "Invalid OTP");
      }
    } catch (error: any) {
      console.error("OTP verify error:", error);
      throw error;
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOTP = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    return sendOTP(email);
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      const result = await apiForgotPassword(email);

      if (result.success) {
        return {
          success: true,
          message: result.message || "Password reset email sent successfully",
        };
      } else {
        throw new Error(result.message || "Failed to send reset email");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      throw error;
    } finally {
      setOtpLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      const result = await apiResetPassword(email, otp, newPassword);

      if (result.success) {
        return {
          success: true,
          message: result.message || "Password reset successfully",
        };
      } else {
        throw new Error(result.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw error;
    } finally {
      setOtpLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      console.log("🔄 Attempting login for:", email);
      const result = await apiLogin(email, password);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return {
          success: true,
          message: result.message || "Login successful",
        };
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    userData: any
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      console.log("🔄 Registering user:", userData.email);

      const registerData = {
        name: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        userType: userData.userType || "client",
        title: userData.title || "",
        skills: userData.skills || [],
        bio: userData.bio || "",
      };

      const result = await apiRegister(registerData);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return {
          success: true,
          message: result.message || "Registration successful",
        };
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setOtpSent(false);
    setOtpVerified(false);
    apiLogout();
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
    sendOTP,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    otpSent,
    otpVerified,
    otpLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export AuthContext as named export
export { AuthContext };
