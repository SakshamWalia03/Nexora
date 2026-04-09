import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

let isRefreshing = false;
let isLoggingOut = false;

export function setLoggingOut(value) {
  isLoggingOut = value;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (isLoggingOut) {
      return Promise.reject(error);
    }

    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export async function register({ email, username, password }) {
    const response = await api.post("/auth/register", { email, username, password });
    return response.data;
}

export async function login({ email, password }) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
}

export async function getMe() {
    const response = await api.get("/auth/get-me");
    return response.data;
}

export async function handleVerify(token) {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
}

export async function logout() {
    const response = await api.post("/auth/logout");
    return response.data;
}

export async function logoutAll() {
    const response = await api.post("/auth/logout-all");
    return response.data;
}

export async function forgotPassword({ email }) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
}

export async function resetPassword({ token, password }) {
    const response = await api.post(`/auth/reset-password?token=${token}`, { password });
    return response.data;
}

export function loginWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
}

export function loginWithGithub() {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
}
