// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (logout on token expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  signup: (email, password, fullName, role) =>
    apiClient.post('/api/auth/signup', { email, password, fullName, role }),
  login: (email, password) =>
    apiClient.post('/api/auth/login', { email, password }),
};

export const doctors = {
  getAll: (params) => apiClient.get('/api/doctors', { params }),
  getById: (id) => apiClient.get(`/api/doctors/${id}`),
};

export const appointments = {
  create: (data) => apiClient.post('/api/appointments', data),
  getByUser: (userId, role) => apiClient.get(`/api/appointments/${userId}/${role}`),
  updateStatus: (id, status) => apiClient.patch(`/api/appointments/${id}`, { status }),
};

export const ratings = {
  create: (data) => apiClient.post('/api/ratings', data),
  getByDoctor: (doctorId) => apiClient.get(`/api/ratings/${doctorId}`),
};