import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse, Sweet, SweetFormData, Cart } from '../types/index';

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

  create: async (data: SweetFormData, imageFile?: File): Promise<Sweet> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', data.price.toString());
    formData.append('quantity', data.quantity.toString());
    if (data.description) formData.append('description', data.description);
    if (imageFile) formData.append('image', imageFile);

    const response = await api.post('/sweets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<SweetFormData>, imageFile?: File): Promise<Sweet> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.category) formData.append('category', data.category);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.quantity !== undefined) formData.append('quantity', data.quantity.toString());
    if (data.description) formData.append('description', data.description);
    if (imageFile) formData.append('image', imageFile);

    const response = await api.put(`/sweets/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

// Cart API
export const cartAPI = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (sweetId: string, quantity: number): Promise<Cart> => {
    const response = await api.post('/cart/add', { sweetId, quantity });
    return response.data;
  },

  updateQuantity: async (sweetId: string, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/update/${sweetId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (sweetId: string): Promise<Cart> => {
    const response = await api.delete(`/cart/remove/${sweetId}`);
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  checkout: async (): Promise<{ message: string; cart: Cart }> => {
    const response = await api.post('/cart/checkout');
    return response.data;
  },
};

export default api;
