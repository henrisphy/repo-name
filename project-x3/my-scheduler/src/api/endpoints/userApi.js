// src/api/endpoints/userApi.js
import axiosInstance from '../axiosConfig';

export const userApi = {
  getAll: () => {
    return axiosInstance.get('/users');
  },
  
  getById: (username) => {
    return axiosInstance.get(`/users/${username}`);
  },
  
  getTeam: async (division) => {
    // JSON Server filter dengan query params
    const response = await axiosInstance.get('/users', {
      params: { 
        division: division,
        role: 'staff'
      }
    });
    
    // Filter manual untuk memastikan hanya staff
    const staff = response.data.filter(user => user.role === 'staff');
    return { data: staff };
  },
  
  update: (username, data) => {
    return axiosInstance.patch(`/users/${username}`, data);
  },
};