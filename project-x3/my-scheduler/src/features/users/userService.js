import { userApi } from '../../api/endpoints/userApi';

export const userService = {
  getAll: async () => {
    const response = await userApi.getAll();
    return response.data;
  },
  getById: async (username) => {
    const response = await userApi.getById(username);
    return response.data;
  },
  getTeam: async (division) => {
    const response = await userApi.getTeam(division);
    return response.data;
  },
  update: async (username, data) => {
    const response = await userApi.update(username, data);
    return response.data;
  },
};