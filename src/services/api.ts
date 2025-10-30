// API service for backend communication
const API_BASE_URL = "http://localhost:5000/api";

// Auth endpoints
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  userType: "freelancer" | "client";
  title: string;
  skills?: string[];
  bio?: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const login = async (
  email: string,
  password: string,
  userType: "freelancer" | "client"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, userType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.success && data.token) {
      localStorage.setItem("freelancer_token", data.token);
      localStorage.setItem("freelancer_user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const sendOTP = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send OTP");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "OTP verification failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send password reset OTP");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in forgot password:", error);
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Password reset failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Freelancer endpoints
export const searchFreelancers = async (filters: {
  query?: string;
  skills?: string;
  level?: string;
  location?: string;
}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();

    if (filters.query) params.append("query", filters.query);
    if (filters.skills) params.append("skills", filters.skills);
    if (filters.level) params.append("level", filters.level);
    if (filters.location) params.append("location", filters.location);

    const response = await fetch(
      `${API_BASE_URL}/freelancers/search?${params}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching freelancers:", error);
    throw error;
  }
};

export const getAllFreelancers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/freelancers`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting all freelancers:", error);
    throw error;
  }
};

// Create sample freelancers (for testing)
export const createSampleFreelancers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/freelancers/sample`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating sample freelancers:", error);
    throw error;
  }
};

// User endpoints
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("freelancer_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid, clear localStorage
        localStorage.removeItem("freelancer_token");
        localStorage.removeItem("freelancer_user");
        throw new Error("Authentication failed. Please login again.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: {
  name?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  hourlyRate?: number;
  experienceLevel?: string;
}) => {
  try {
    const token = localStorage.getItem("freelancer_token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Profile update failed");
    }

    const data = await response.json();

    // Update user in localStorage
    if (data.success && data.data) {
      localStorage.setItem("freelancer_user", JSON.stringify(data.data));
    }

    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("freelancer_token");
  const user = localStorage.getItem("freelancer_user");

  return !!(token && user);
};

// Utility function to logout
export const logout = (): void => {
  localStorage.removeItem("freelancer_token");
  localStorage.removeItem("freelancer_user");
};

// Utility function to get current user from localStorage
export const getCurrentUserFromStorage = () => {
  const userStr = localStorage.getItem("freelancer_user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  }
  return null;
};

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);

    if (!response.ok) {
      throw new Error(`Backend connection failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Backend connection test failed:", error);
    throw error;
  }
};

// Export all functions as an object
export const api = {
  // Auth
  register,
  login,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,

  // Freelancers
  searchFreelancers,
  getAllFreelancers,
  createSampleFreelancers,

  // Users
  getCurrentUser,
  updateUserProfile,

  // Utilities
  isAuthenticated,
  logout,
  getCurrentUserFromStorage,
  testBackendConnection,
};

export default api;
