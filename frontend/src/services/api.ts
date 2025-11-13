// src/services/api.ts
import { toast } from "react-toastify";

// Helper function to get token
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Enhanced fetch with error handling - FIXED HeadersInit type
export const fetchWithErrorHandling = async (
  url: string,
  options: RequestInit = {}
) => {
  try {
    const token = getToken();

    // FIX: Use Record<string, string> instead of HeadersInit to avoid TypeScript errors
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Merge with existing headers
    const existingHeaders = (options.headers as Record<string, string>) || {};
    const finalHeaders = {
      ...headers,
      ...existingHeaders,
    };

    console.log("🔐 Making request to:", url, "with token:", !!token);

    const response = await fetch(url, {
      ...options,
      headers: finalHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed for", url, error);
    throw error;
  }
};

// ========== AUTH UTILITY FUNCTIONS ==========
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getCurrentUserFromStorage = (): any => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from storage:", error);
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("🚪 User logged out");
};

// ========== AUTH API FUNCTIONS ==========
export const login = async (email: string, password: string) => {
  console.log("🔐 API: Logging in user");
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return {
        success: true,
        message: data.message || "Login successful",
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }
  } catch (error: any) {
    console.error("Login API error:", error);
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};

export const register = async (userData: any) => {
  console.log("👤 API: Registering user");
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return {
        success: true,
        message: data.message || "Registration successful",
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }
  } catch (error: any) {
    console.error("Registration API error:", error);
    return {
      success: false,
      message: error.message || "Registration failed",
    };
  }
};

export const sendOTP = async (email: string) => {
  console.log("📧 API: Sending OTP");
  try {
    const response = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Send OTP API error:", error);
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  console.log("✅ API: Verifying OTP");
  try {
    const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Verify OTP API error:", error);
    return {
      success: false,
      message: error.message || "Failed to verify OTP",
    };
  }
};

export const forgotPassword = async (email: string) => {
  console.log("🔑 API: Forgot password");
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return {
      success: false,
      message: error.message || "Failed to process forgot password",
    };
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  console.log("🔄 API: Resetting password");
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return {
      success: false,
      message: error.message || "Failed to reset password",
    };
  }
};

export const getCurrentUser = async () => {
  console.log("👤 API: Getting current user");
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: "No token found",
      };
    }

    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error: any) {
    console.error("Get current user API error:", error);
    return {
      success: false,
      message: error.message || "Failed to get current user",
    };
  }
};

// ========== PORTFOLIO API FUNCTIONS ==========
export const savePortfolio = async (portfolioData: any) => {
  console.log("💾 API: Saving portfolio");
  return await fetchWithErrorHandling(
    "http://localhost:5000/api/portfolio/save",
    {
      method: "POST",
      body: JSON.stringify(portfolioData),
    }
  );
};

export const getMyPortfolio = async () => {
  console.log("📁 API: Getting my portfolio");
  return await fetchWithErrorHandling(
    "http://localhost:5000/api/portfolio/my-portfolio"
  );
};

export const publishPortfolio = async () => {
  console.log("🚀 API: Publishing portfolio");
  return await fetchWithErrorHandling(
    "http://localhost:5000/api/portfolio/publish",
    {
      method: "POST",
    }
  );
};

export const deletePortfolio = async () => {
  console.log("🗑️ API: Deleting portfolio");
  return await fetchWithErrorHandling(
    "http://localhost:5000/api/portfolio/delete",
    {
      method: "DELETE",
    }
  );
};

// ========== SEARCH API FUNCTIONS ==========
export const searchFreelancers = async (searchParams: {
  query?: string;
  skills?: string[];
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    console.log("🔍 API: Searching freelancers", searchParams);

    const queryParams = new URLSearchParams();

    if (searchParams.query) queryParams.append("query", searchParams.query);
    if (searchParams.location)
      queryParams.append("location", searchParams.location);
    if (searchParams.category)
      queryParams.append("category", searchParams.category);
    if (searchParams.minExperience !== undefined)
      queryParams.append(
        "minExperience",
        searchParams.minExperience.toString()
      );
    if (searchParams.maxExperience !== undefined)
      queryParams.append(
        "maxExperience",
        searchParams.maxExperience.toString()
      );
    if (searchParams.page)
      queryParams.append("page", searchParams.page.toString());
    if (searchParams.limit)
      queryParams.append("limit", searchParams.limit.toString());

    if (searchParams.skills && searchParams.skills.length > 0) {
      searchParams.skills.forEach((skill) => {
        queryParams.append("skills", skill);
      });
    }

    const url = `http://localhost:5000/api/search/freelancers?${queryParams.toString()}`;
    console.log("Search URL:", url);

    const response = await fetchWithErrorHandling(url);
    return response;
  } catch (error) {
    console.error("Search freelancers API error:", error);
    throw error;
  }
};

// Add other API functions as needed...

export default {
  // Auth
  login,
  register,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
  isAuthenticated,
  getCurrentUserFromStorage,

  // Portfolio
  savePortfolio,
  getMyPortfolio,
  publishPortfolio,
  deletePortfolio,

  // Search
  searchFreelancers,

  // Core
  fetchWithErrorHandling,
};
