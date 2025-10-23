import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  isAdmin: false,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    console.log("🚀 Signup started - API_URL:", API_URL);
    try {
      console.log("📤 Sending request to:", `${API_URL}/signup`);
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      console.log("✅ Signup response:", response.data);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("❌ Signup error:", error);
      console.error("Error response:", error.response);
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const user = response.data.user;
      // Check if user is admin based on email or is_admin flag
      const isAdmin = user.is_admin || user.email === "east.strategi.company@gmail.com";
      set({
        isAuthenticated: true,
        user: user,
        error: null,
        isLoading: false,
        isAdmin: isAdmin,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    console.log("📧 Verifying email with code:", code);
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      console.log("✅ Verify email response:", response.data);
      const user = response.data.user;
      // Check if user is admin based on email or is_admin flag
      const isAdmin = user.is_admin || user.email === "east.strategi.company@gmail.com";
      set({
        user: user,
        isAuthenticated: true,
        isLoading: false,
        isAdmin: isAdmin,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Verify email error:", error.response?.data);
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      const user = response.data.user;
      // Check if user is admin based on email or is_admin flag
      const isAdmin = user.is_admin || user.email === "east.strategi.company@gmail.com";
      set({
        user: user,
        isAuthenticated: true,
        isCheckingAuth: false,
        isAdmin: isAdmin,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
  checkAdminStatus: async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/admin/check", {
        withCredentials: true,
      });
      set({ isAdmin: response.data.admin });
    } catch (error) {
      set({ isAdmin: false });
    }
  },
}));
