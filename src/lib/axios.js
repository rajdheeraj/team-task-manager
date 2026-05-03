import axios from "axios";

// 🔥 Base URL (use env OR fallback to Railway)
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://team-task-manager-production-08a2.up.railway.app/api";

const api = axios.create({
  baseURL,
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ⚠️ Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;