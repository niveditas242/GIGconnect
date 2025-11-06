// frontend/src/services/api.ts
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Enhanced fetch with error handling
const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};

// API calls
export const api = {
  // Send OTP
  async sendOTP(email: string) {
    console.log("📧 API: Sending OTP to", email);
    return await fetchWithErrorHandling(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "registration" }),
    });
  },

  // Verify OTP
  async verifyOTP(email: string, otp: string) {
    console.log("🔐 API: Verifying OTP for", email);
    return await fetchWithErrorHandling(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
  },

  // Register user
  async register(userData: any) {
    console.log("👤 API: Registering user", userData.email);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Registration failed: ${response.status}`
      );
    }

    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ API: Registration successful, token saved");
    }

    return data;
  },

  // Login user
  async login(email: string, password: string) {
    console.log("🔑 API: Logging in user", email);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Login failed: ${response.status}`);
    }

    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ API: Login successful, token saved");
    }

    return data;
  },

  // Forgot password
  async forgotPassword(email: string) {
    console.log("🔓 API: Forgot password for", email);
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
  },

  // Reset password
  async resetPassword(email: string, otp: string, newPassword: string) {
    console.log("🔄 API: Resetting password for", email);
    return await fetchWithErrorHandling(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  // Get current user
  async getCurrentUser() {
    console.log("👤 API: Getting current user");
    return await fetchWithErrorHandling(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
  },

  // Test backend connection
  async testConnection() {
    console.log("🔗 API: Testing backend connection");
    try {
      const response = await fetch(`${API_BASE_URL}/auth`);
      if (!response.ok) {
        throw new Error(`Backend not responding: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("❌ API: Backend connection test failed");
      throw error;
    }
  },
};

// Auth utility functions
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  const hasToken = !!token;
  console.log(
    "🔐 Auth: Checking authentication -",
    hasToken ? "Authenticated" : "Not authenticated"
  );
  return hasToken;
};

export const getCurrentUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  console.log(
    "👤 Auth: Getting user from storage -",
    user ? "User found" : "No user"
  );
  return user;
};

export const logout = () => {
  console.log("🚪 Auth: Logging out");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Export all functions for backward compatibility
export const sendOTP = (email: string) => api.sendOTP(email);
export const verifyOTP = (email: string, otp: string) =>
  api.verifyOTP(email, otp);
export const register = (userData: any) => api.register(userData);
export const login = (email: string, password: string) =>
  api.login(email, password);
export const forgotPassword = (email: string) => api.forgotPassword(email);
export const resetPassword = (
  email: string,
  otp: string,
  newPassword: string
) => api.resetPassword(email, otp, newPassword);
export const getCurrentUser = () => api.getCurrentUser();
export const testConnection = () => api.testConnection();

export default api;
