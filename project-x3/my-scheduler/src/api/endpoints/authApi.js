// src/api/endpoints/authApi.js
import axiosInstance from '../axiosConfig';

export const authApi = {
  login: async (credentials) => {
    try {
      // JSON Server - cari user berdasarkan username
      const response = await axiosInstance.get('/users', {
        params: {
          username: credentials.username,
        }
      });
      
      console.log('API Response:', response.data); // Debug
      
      const users = response.data;
      const user = Array.isArray(users) ? users[0] : null;
      
      if (!user) {
        throw new Error('User not found');
      }

      // Generate mock token
      const token = 'mock-jwt-token-' + Date.now();
      
      return {
        data: {
          token,
          user: {
            username: user.username,
            name: user.name,
            role: user.role,
            division: user.division,
            team: user.team,
          }
        }
      };
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },
  
  logout: () => {
    return Promise.resolve({ data: { success: true } });
  },
  
  getCurrentUser: async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      throw new Error('No user logged in');
    }
    const response = await axiosInstance.get(`/users/${username}`);
    return response;
  },
  
  register: (userData) => {
    return axiosInstance.post('/users', userData);
  },
};