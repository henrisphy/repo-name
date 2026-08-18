import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTasks } from "../../contexts/TaskContext";
import SidebarStaff from "../../components/SidebarStaff";
import "./DashboardStaff.css";

function DashboardStaff() {
  const { user } = useAuth();
  const { getTasksByUser } = useTasks();

  const userTasks = getTasksByUser(user?.username || "");
  const taskStats = {
    total: userTasks.length,
    working: userTasks.filter((t) => t.status === "working").length,
    completed: userTasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="dashboardLayout">
      <SidebarStaff />
      <main className="dashboardMain">
        <Outlet context={{ userTasks, taskStats }} />
      </main>
    </div>
  );
}

export default DashboardStaff;
