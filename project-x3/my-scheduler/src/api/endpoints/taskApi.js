import axiosInstance from "../axiosConfig";

const UPLOAD_URL = "http://localhost:3001/upload";

export const taskApi = {
  getAll: (division) => {
    return axiosInstance.get("/tasks", {
      params: { division },
    });
  },

  getById: (id) => {
    return axiosInstance.get(`/tasks/${id}`);
  },

  getUserTasks: (username) => {
    return axiosInstance.get("/tasks", {
      params: { assignedTo: username },
    });
  },

  create: (data) => {
    const taskData = {
      ...data,
      status: data.status || "working",
      completedAt: data.completedAt || null,
      comments: data.comments || [],
      photos: data.photos || [],
      createdAt: new Date().toISOString(),
    };
    return axiosInstance.post("/tasks", taskData);
  },

  update: (id, data) => {
    return axiosInstance.patch(`/tasks/${id}`, data);
  },

  delete: (id) => {
    return axiosInstance.delete(`/tasks/${id}`);
  },

  addComment: async (taskId, data) => {
    const response = await axiosInstance.get(`/tasks/${taskId}`);
    const task = response.data;

    const newComment = {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString(),
    };

    task.comments = [...(task.comments || []), newComment];
    return axiosInstance.patch(`/tasks/${taskId}`, { comments: task.comments });
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  },

  addPhoto: async (taskId, data) => {
    const response = await axiosInstance.get(`/tasks/${taskId}`);
    const task = response.data;

    const newPhoto = {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString(),
    };

    const currentPhotos = task.photos || [];
    task.photos = [...currentPhotos, newPhoto];

    return axiosInstance.patch(`/tasks/${taskId}`, { photos: task.photos });
  },

  complete: (id) => {
    return axiosInstance.patch(`/tasks/${id}`, {
      status: "completed",
      completedAt: new Date().toISOString().split("T")[0],
    });
  },
};
