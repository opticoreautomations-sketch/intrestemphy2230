const API_URL = ""; // Relative to the same host

export const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("physics_token");
    const headers: any = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // Only set Content-Type to application/json if it's not already set
    // and if we're not sending FormData (which sets its own boundary)
    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

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
    async forgotPassword(email: string) {
      return api.fetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    async resetPassword(data: any) {
      return api.fetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
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
    async upload(file: File) {
      const formData = new FormData();
      formData.append("file", file);
      return api.fetch("/admin/upload", {
        method: "POST",
        body: formData,
      });
    },
  },
};
