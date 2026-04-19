import apiClient from './axios';
import { AuthResponse, LoginResponse } from '@/types/auth.types';

interface ApiWrapper<T> {
  success: boolean;
  data: T;
}

export const authApi = {
  register: async (data: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiWrapper<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiWrapper<LoginResponse>>('/auth/login', data);
    return res.data.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: { fullName?: string; reminderEmail?: string }) => {
    // Settings page uses this via /users endpoint if available
    const res = await apiClient.patch('/auth/me', data);
    return res.data.data;
  },
};
