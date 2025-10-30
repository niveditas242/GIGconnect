const API_BASE_URL = "http://localhost:5000/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileCompleted: boolean;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  error?: string;
  requiresVerification?: boolean;
  message?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers[key] = value as string;
      });
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth methods
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<{ success: boolean; user: User }> {
    return this.request("/auth/me");
  }
}

export const apiService = new ApiService();
