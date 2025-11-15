import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse, Sweet, SweetFormData } from '../types/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Sweets API
export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get('/sweets');
    return response.data;
  },

  search: async (params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }): Promise<Sweet[]> => {
    const response = await api.get('/sweets/search', { params });
    return response.data;
  },

  create: async (data: SweetFormData): Promise<Sweet> => {
    const response = await api.post('/sweets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<SweetFormData>): Promise<Sweet> => {
    const response = await api.put(`/sweets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },

  purchase: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  restock: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/sweets/${id}/restock`, { quantity });
    return response.data;
  },
};

export default api;
