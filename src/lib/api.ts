const API_URL = ""; // Relative to the same host

export const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("physics_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Something went wrong");
    }

    return response.json();
  },

  auth: {
    async login(credentials: any) {
      const data = await api.fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      localStorage.setItem("physics_token", data.token);
      return data.user;
    },
    async signup(userData: any) {
      return api.fetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    async me() {
      return api.fetch("/auth/me");
    },
    logout() {
      localStorage.removeItem("physics_token");
    },
  },

  content: {
    async get(type: string) {
      return api.fetch(`/content/${type}`);
    },
    async update(data: any) {
      return api.fetch("/content", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  progress: {
    async trackView(contentType: string) {
      return api.fetch("/progress/view", {
        method: "POST",
        body: JSON.stringify({ content_type: contentType }),
      });
    },
  },

  admin: {
    async getStats() {
      return api.fetch("/admin/stats");
    },
    async deleteStudent(id: string) {
      return api.fetch(`/admin/students/${id}`, {
        method: "DELETE",
      });
    },
  },
};
