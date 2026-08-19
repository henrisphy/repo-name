import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskApi } from "../../api/endpoints/taskApi";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (division, { rejectWithValue }) => {
    try {
      const response = await taskApi.getAll(division);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const fetchUserTasks = createAsyncThunk(
  "tasks/fetchUserTasks",
  async (username, { rejectWithValue }) => {
    try {
      const response = await taskApi.getUserTasks(username);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user tasks"
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await taskApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const payload = {
        ...taskData,
        status: taskData.status || "working",
        completedAt: taskData.completedAt || null,
        comments: taskData.comments || [],
        photos: taskData.photos || [],
        createdAt: new Date().toISOString(),
      };
      const response = await taskApi.create(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await taskApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const completeTask = createAsyncThunk(
  "tasks/complete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await taskApi.complete(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await taskApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, commentData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addComment(taskId, commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const uploadPhotoFile = createAsyncThunk(
  "tasks/uploadPhoto",
  async (file, { rejectWithValue }) => {
    try {
      const result = await taskApi.uploadPhoto(file);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to upload photo");
    }
  }
);

export const addPhoto = createAsyncThunk(
  "tasks/addPhoto",
  async ({ taskId, photoData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addPhoto(taskId, photoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add photo"
      );
    }
  }
);

const initialState = {
  tasks: [],
  userTasks: [],
  currentTask: null,
  loading: false,
  error: null,
  stats: {
    total: 0,
    working: 0,
    completed: 0,
  },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    updateTaskStats: (state) => {
      const tasks = state.tasks;
      state.stats = {
        total: tasks.length,
        working: tasks.filter((t) => t.status === "working").length,
        completed: tasks.filter((t) => t.status === "completed").length,
      };
    },
    updateTaskLocally: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
      if (state.currentTask?.id === updatedTask.id) {
        state.currentTask = updatedTask;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
        const tasks = action.payload;
        state.stats = {
          total: tasks.length,
          working: tasks.filter((t) => t.status === "working").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        };
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks";
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.userTasks = action.payload;
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
        const exists = state.tasks.some((t) => t.id === action.payload.id);
        if (!exists) {
          state.tasks.push(action.payload);
        } else {
          const index = state.tasks.findIndex(
            (t) => t.id === action.payload.id
          );
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch task";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.loading = false;
        const tasks = state.tasks;
        state.stats = {
          total: tasks.length,
          working: tasks.filter((t) => t.status === "working").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        };
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
        state.loading = false;
        const tasks = state.tasks;
        state.stats = {
          total: tasks.length,
          working: tasks.filter((t) => t.status === "working").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        };
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
        state.loading = false;
        const tasks = state.tasks;
        state.stats = {
          total: tasks.length,
          working: tasks.filter((t) => t.status === "working").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        };
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
        state.loading = false;
        const tasks = state.tasks;
        state.stats = {
          total: tasks.length,
          working: tasks.filter((t) => t.status === "working").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        };
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const taskId = action.payload.id;
        const index = state.tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === taskId) {
          state.currentTask = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add comment";
      })
      .addCase(addPhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPhoto.fulfilled, (state, action) => {
        const taskId = action.payload.id;
        const index = state.tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === taskId) {
          state.currentTask = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(addPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add photo";
      });
  },
});

export const {
  clearTaskError,
  setCurrentTask,
  clearCurrentTask,
  updateTaskStats,
  updateTaskLocally,
} = taskSlice.actions;

export default taskSlice.reducer;
