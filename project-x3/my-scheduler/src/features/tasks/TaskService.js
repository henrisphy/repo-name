import { taskApi } from '../../api/endpoints/taskApi';

export const taskService = {
  getAll: async (division) => {
    const response = await taskApi.getAll(division);
    return response.data;
  },
  getById: async (id) => {
    const response = await taskApi.getById(id);
    return response.data;
  },
  getUserTasks: async (username) => {
    const response = await taskApi.getUserTasks(username);
    return response.data;
  },
  create: async (data) => {
    const response = await taskApi.create(data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await taskApi.update(id, data);
    return response.data;
  },
  delete: async (id) => {
    await taskApi.delete(id);
  },
  addComment: async (taskId, data) => {
    const response = await taskApi.addComment(taskId, data);
    return response.data;
  },
  addPhoto: async (taskId, data) => {
    const response = await taskApi.addPhoto(taskId, data);
    return response.data;
  },
  complete: async (id) => {
    const response = await taskApi.complete(id);
    return response.data;
  },
};