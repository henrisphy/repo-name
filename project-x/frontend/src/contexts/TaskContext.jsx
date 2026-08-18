import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/tasks?${params}`);
      const mapped = res.data.map((task) => ({
        ...task,
        assignedTo: task.assigned_to,
        assignedBy: task.assigned_by,
        assignedToName: task.assigned_to_name || task.assignedTo,
        assignedByName: task.assigned_by_name || task.assignedBy,
        comments: task.comments || [],
        photos: task.photos || [],
      }));
      setTasks(mapped);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
      };
      const res = await api.post("/tasks", payload);
      const newTask = {
        ...res.data,
        assignedTo: res.data.assigned_to,
        assignedBy: res.data.assigned_by,
        assignedToName: taskData.assignedToName || res.data.assigned_to,
        assignedByName: taskData.assignedByName || res.data.assigned_by,
        comments: [],
        photos: [],
      };
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error("Add task error:", err);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      const updated = {
        ...res.data,
        assignedTo: res.data.assigned_to,
        assignedBy: res.data.assigned_by,
        assignedToName: res.data.assigned_to_name || res.data.assigned_to,
        assignedByName: res.data.assigned_by_name || res.data.assigned_by,
        comments: res.data.comments || [],
        photos: res.data.photos || [],
      };
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      return updated;
    } catch (err) {
      console.error("Update task error:", err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
      throw err;
    }
  };

  const addComment = async (taskId, username, userName, text) => {
    try {
      const res = await api.post(`/tasks/${taskId}/comments`, { text });
      const newComment = {
        ...res.data,
        id: res.data.id || Date.now(),
        user: res.data.username || username,
        userName: res.data.user_name || userName,
        timestamp: res.data.timestamp || new Date().toLocaleString(),
      };
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, comments: [...(task.comments || []), newComment] }
            : task
        )
      );
      return newComment;
    } catch (err) {
      console.error("Add comment error:", err);
      throw err;
    }
  };

  const addPhoto = async (taskId, file, caption, currentUser) => {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("caption", caption || "");

    try {
      const res = await api.post(`/upload/tasks/${taskId}/photos`, formData);
      const newPhoto = {
        ...res.data,
        id: res.data.id || Date.now(),
        user: res.data.username || currentUser.username,
        userName: res.data.user_name || currentUser.name,
        timestamp: res.data.timestamp || new Date().toLocaleString(),
      };
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, photos: [...(task.photos || []), newPhoto] }
            : task
        )
      );
      return newPhoto;
    } catch (err) {
      console.error("Upload photo error:", err);
      throw err;
    }
  };

  const completeTask = async (taskId) => {
    return await updateTask(taskId, { status: "completed" });
  };

  const getTasksByDivision = (division) => {
    return tasks.filter((task) => task.division === division);
  };

  const getTasksByUser = (username) => {
    return tasks.filter((task) => task.assignedTo === username);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const getTaskStats = (division) => {
    const filtered = division
      ? tasks.filter((t) => t.division === division)
      : tasks;
    return {
      total: filtered.length,
      working: filtered.filter((t) => t.status === "working").length,
      completed: filtered.filter((t) => t.status === "completed").length,
    };
  };

  const resetTasks = () => {
    fetchTasks();
  };

  const markTaskAsRead = (taskId, username) => {};
  const getUnreadCount = (taskId, username) => 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        addComment,
        addPhoto,
        completeTask,
        getTasksByDivision,
        getTasksByUser,
        getTasksByStatus,
        getTaskStats,
        resetTasks,
        markTaskAsRead,
        getUnreadCount,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}

export default TaskProvider;
