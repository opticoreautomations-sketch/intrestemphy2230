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
      let errorMessage = "Something went wrong";
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        // Not JSON, use status text or generic message
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
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

  lessons: {
    async getByCategory(category: string) {
      return api.fetch(`/lessons/${category}`);
    },
    async getById(id: string) {
      return api.fetch(`/lesson/${id}`);
    },
    async save(data: any) {
      return api.fetch("/lessons", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async delete(id: string) {
      return api.fetch(`/lessons/${id}`, {
        method: "DELETE",
      });
    },
  },

  progress: {
    async trackView(lessonId: string | number) {
      return api.fetch("/progress/view", {
        method: "POST",
        body: JSON.stringify({ lesson_id: lessonId }),
      });
    },
  },

  materials: {
    async getAll() {
      return api.fetch("/materials");
    },
    async create(data: any) {
      return api.fetch("/materials", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async delete(id: string | number) {
      return api.fetch(`/materials/${id}`, {
        method: "DELETE",
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
