import { authApi } from '../../api/endpoints/authApi';

export const authService = {
  login: async (credentials) => {
    const response = await authApi.login(credentials);
    return response.data;
  },
  logout: async () => {
    await authApi.logout();
  },
  getCurrentUser: async () => {
    const response = await authApi.getCurrentUser();
    return response.data;
  },
  register: async (userData) => {
    const response = await authApi.register(userData);
    return response.data;
  },
};