import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

const users = [
  {
    username: "lead",
    password: "lead123",
    role: "lead",
    name: "Budi Santoso",
    division: "Engineering",
    team: ["john", "jane", "bob"],
    avatar: null,
  },
  {
    username: "john",
    password: "john123",
    role: "member",
    name: "John Doe",
    division: "Engineering",
    avatar: null,
  },
  {
    username: "jane",
    password: "jane123",
    role: "member",
    name: "Jane Smith",
    division: "Engineering",
    avatar: null,
  },
  {
    username: "bob",
    password: "bob123",
    role: "member",
    name: "Bob Johnson",
    division: "Engineering",
    avatar: null,
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    return new Promise((resolve) => {
      const found = users.find(
        (u) => u.username === username && u.password === password
      );
      if (found) {
        const { password: _, ...userWithoutPassword } = found;
        const userData = { ...userWithoutPassword, loggedIn: true };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const getTeamMembers = () => {
    if (user?.role === "lead") {
      const leadUser = users.find((u) => u.username === user.username);
      if (leadUser && leadUser.team) {
        return users.filter((u) => leadUser.team.includes(u.username));
      }
    }
    return [];
  };

  const getLead = (username) => {
    const member = users.find((u) => u.username === username);
    if (member) {
      const lead = users.find(
        (u) => u.role === "lead" && u.division === member.division
      );
      return lead || null;
    }
    return null;
  };

  const getUserByUsername = (username) => {
    return users.find((u) => u.username === username);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        getTeamMembers,
        getLead,
        getUserByUsername,
        users,
        isLead: user?.role === "lead",
        isMember: user?.role === "member",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
