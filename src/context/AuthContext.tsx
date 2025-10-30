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
    password: string,
    userType: "freelancer" | "client" // Fix: Specify the exact type
  ) => Promise<{ success: boolean; message: string }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  // OTP Functions
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  // Password Reset
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  // OTP State
  otpSent: boolean;
  otpVerified: boolean;
  otpLoading: boolean;
}

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
      // Check if user is authenticated from localStorage
      if (apiIsAuthenticated()) {
        try {
          // Verify token with backend
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.data);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            apiLogout();
          }
        } catch (error) {
          console.error("Error verifying authentication:", error);
          apiLogout();
        }
      } else {
        // Try to get user from localStorage for demo fallback
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

  // Send OTP to email
  const sendOTP = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      const result = await apiSendOTP(email);

      if (result.success) {
        setOtpSent(true);
        return {
          success: true,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error sending OTP. Please try again.",
      };
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      const result = await apiVerifyOTP(email, otp);

      if (result.success) {
        setOtpVerified(true);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error verifying OTP. Please try again.",
      };
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    return sendOTP(email);
  };

  // Forgot Password
  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      const result = await apiForgotPassword(email);
      return result;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.message ||
          "Error processing forgot password. Please try again.",
      };
    } finally {
      setOtpLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    setOtpLoading(true);
    try {
      const result = await apiResetPassword(email, otp, newPassword);
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error resetting password. Please try again.",
      };
    } finally {
      setOtpLoading(false);
    }
  };

  // Login function - connects to real backend
  const login = async (
    email: string,
    password: string,
    userType: "freelancer" | "client" // Fix: Specify the exact type
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const result = await apiLogin(email, password, userType);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function - connects to real backend
  const register = async (
    userData: any
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      // Format data for backend API
      const registerData = {
        name: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
        title:
          userData.title ||
          `${userData.userType === "freelancer" ? "Freelancer" : "Client"}`,
        skills: userData.skills || [],
        bio: userData.bio || "",
      };

      const result = await apiRegister(registerData);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      };
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading,
        // OTP Functions
        sendOTP,
        verifyOTP,
        resendOTP,
        // Password Reset
        forgotPassword,
        resetPassword,
        // OTP State
        otpSent,
        otpVerified,
        otpLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
