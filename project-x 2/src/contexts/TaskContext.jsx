// TaskContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

const initialTasks = [
  {
    id: 1,
    title: "Create Monthly Report",
    description:
      "Create financial report for August 2026 for Engineering Division",
    assignedTo: "john",
    assignedToName: "John Doe",
    assignedBy: "lead",
    assignedByName: "Budi Santoso",
    division: "Engineering",
    dueDate: "2026-08-20",
    status: "working",
    priority: "high",
    comments: [
      {
        id: 1,
        user: "lead",
        userName: "Budi Santoso",
        text: "Please complete before the 20th",
        timestamp: "2026-08-10 09:00",
      },
      {
        id: 2,
        user: "john",
        userName: "John Doe",
        text: "Okay, I will complete it",
        timestamp: "2026-08-11 14:30",
      },
    ],
    photos: [{ id: 1, url: "/images/report1.jpg", caption: "Initial report" }],
    createdAt: "2026-08-10",
    completedAt: null,
  },
  {
    id: 2,
    title: "Review UI Design Dashboard",
    description: "Review the new dashboard design for Engineering Division",
    assignedTo: "jane",
    assignedToName: "Jane Smith",
    assignedBy: "lead",
    assignedByName: "Budi Santoso",
    division: "Engineering",
    dueDate: "2026-08-25",
    status: "working",
    priority: "medium",
    comments: [],
    photos: [],
    createdAt: "2026-08-12",
    completedAt: null,
  },
  {
    id: 3,
    title: "Fix Server Bug",
    description: "Fix 500 error on production server",
    assignedTo: "bob",
    assignedToName: "Bob Johnson",
    assignedBy: "lead",
    assignedByName: "Budi Santoso",
    division: "Engineering",
    dueDate: "2026-08-15",
    status: "completed",
    priority: "high",
    comments: [
      {
        id: 3,
        user: "lead",
        userName: "Budi Santoso",
        text: "This is urgent!",
        timestamp: "2026-08-13 10:00",
      },
      {
        id: 4,
        user: "bob",
        userName: "Bob Johnson",
        text: "Fixed already",
        timestamp: "2026-08-14 16:00",
      },
      {
        id: 5,
        user: "lead",
        userName: "Budi Santoso",
        text: "Thank you",
        timestamp: "2026-08-14 17:00",
      },
    ],
    photos: [{ id: 2, url: "/images/fix1.jpg", caption: "Fix applied" }],
    createdAt: "2026-08-13",
    completedAt: "2026-08-14",
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [taskReadStatus, setTaskReadStatus] = useState(() => {
    const stored = localStorage.getItem("task_read_status");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("task_read_status", JSON.stringify(taskReadStatus));
  }, [taskReadStatus]);

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const migrated = parsed.map((task) => ({
          ...task,
          status: task.status === "pending" ? "working" : task.status,
          photos: (task.photos || []).map((photo) => ({
            ...photo,
            user: photo.user || task.assignedTo,
            userName: photo.userName || task.assignedToName,
            timestamp:
              photo.timestamp ||
              new Date(photo.id).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
          })),
        }));
        setTasks(migrated);
        localStorage.setItem("tasks", JSON.stringify(migrated));
      } catch (error) {
        console.error("Error parsing tasks:", error);
        setTasks(initialTasks);
        localStorage.setItem("tasks", JSON.stringify(initialTasks));
      }
    } else {
      setTasks(initialTasks);
      localStorage.setItem("tasks", JSON.stringify(initialTasks));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      comments: [],
      photos: [],
      createdAt: new Date().toISOString().split("T")[0],
      completedAt: null,
      status: "working",
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addComment = (taskId, user, userName, text) => {
    const comment = {
      id: Date.now(),
      user,
      userName,
      text,
      timestamp: new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, comment] }
          : task
      )
    );
    setTaskReadStatus((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [user]: Date.now(),
      },
    }));
  };

  const addPhoto = (taskId, photoUrl, caption, currentUser) => {
    const photo = {
      id: Date.now(),
      url: photoUrl,
      caption: caption || "",
      user: currentUser?.username || "unknown",
      userName: currentUser?.name || "Unknown",
      timestamp: new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, photos: [...task.photos, photo] } : task
      )
    );
    setTaskReadStatus((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [currentUser.username]: Date.now(),
      },
    }));
  };

  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed",
              completedAt: new Date().toISOString().split("T")[0],
            }
          : task
      )
    );
  };

  const markTaskAsRead = (taskId, username) => {
    setTaskReadStatus((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [username]: Date.now(),
      },
    }));
  };

  const getUnreadCount = (taskId, username) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return 0;
    const lastRead = taskReadStatus[taskId]?.[username] || 0;
    const allChatTimestamps = [
      ...(task.comments || []).map((c) => new Date(c.timestamp).getTime()),
      ...(task.photos || []).map((p) => p.id),
    ];
    return allChatTimestamps.filter((ts) => ts > lastRead).length;
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
    const divisionTasks = division
      ? tasks.filter((t) => t.division === division)
      : tasks;
    return {
      total: divisionTasks.length,
      working: divisionTasks.filter((t) => t.status === "working").length,
      completed: divisionTasks.filter((t) => t.status === "completed").length,
    };
  };

  const resetTasks = () => {
    setTasks(initialTasks);
    localStorage.setItem("tasks", JSON.stringify(initialTasks));
    console.log("Tasks have been reset to initial data");
  };

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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
