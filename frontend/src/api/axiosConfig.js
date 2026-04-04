import axios from 'react';
import toast from 'react-hot-toast';

// Automatically switch between Vercel production URL and Localhost
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: baseURL,
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling for the frontend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear token so user is forced to log in again
      localStorage.removeItem('token');
    } else if (error.response?.data?.detail) {
      // Display the exact error message from FastAPI
      toast.error(error.response.data.detail);
    } else {
      console.error("API Error:", error);
    }
    return Promise.reject(error);
  }
);

export default api;