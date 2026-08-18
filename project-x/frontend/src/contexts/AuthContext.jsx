import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/session");
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    checkSession();
  }, []);

  useEffect(() => {
    if (user?.role === "lead") {
      fetchStaff();
    } else {
      setStaff([]);
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/team/staff");
      setStaff(res.data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
      setStaff([]);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
    localStorage.removeItem("user");
    setUser(null);
    setStaff([]);
  };

  const getTeamStaff = () => staff;

  const getLead = (username) => {
    if (!username) return null;
    return (
      staff.find((m) => m.role === "lead" && m.division === user?.division) ||
      null
    );
  };

  const getUserByUsername = (username) => {
    return staff.find((m) => m.username === username) || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        getTeamStaff,
        getLead,
        getUserByUsername,
        isLead: user?.role === "lead",
        isStaff: user?.role === "staff",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
