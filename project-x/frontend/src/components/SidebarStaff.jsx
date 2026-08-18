import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import Sidebar from "./reusable/Sidebar";

function SidebarStaff() {
  const { user, getLead } = useAuth();
  const { getTasksByUser } = useTasks();
  const lead = getLead(user?.username);
  const userTasks = getTasksByUser(user?.username || "");

  const workingCount = userTasks.filter((t) => t.status === "working").length;
  const completedCount = userTasks.filter(
    (t) => t.status === "completed"
  ).length;

  const navLinks = [
    { path: "/dashboard/staff", label: "Calendar" },
    { path: "/dashboard/staff/tasks", label: "Task List" },
    { path: "/dashboard/staff/working", label: "Working" },
    { path: "/dashboard/staff/completed", label: "Completed" },
  ];

  return (
    <Sidebar
      title={user?.name || "Staff"}
      subtitle={`${user?.division || ""} Division${
        lead ? ` - Lead: ${lead.name}` : ""
      }`}
      navLinks={navLinks}
      showStats={true}
      stats={{
        working: workingCount,
        completed: completedCount,
      }}
    />
  );
}

export default SidebarStaff;
