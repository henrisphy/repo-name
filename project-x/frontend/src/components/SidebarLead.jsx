import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import Sidebar from "./reusable/Sidebar";

function SidebarLead() {
  const { user } = useAuth();
  const { getTasksByDivision, getTaskStats } = useTasks();
  const stats = getTaskStats(user?.division);

  const navLinks = [
    { path: "/dashboard/lead", label: "Dashboard" },
    { path: "/dashboard/lead/tasks", label: "All Tasks" },
    { path: "/dashboard/lead/create", label: "Create Task" },
    { path: "/dashboard/lead/team", label: "My Team" },
  ];

  return (
    <Sidebar
      title={user?.name || "Lead"}
      subtitle={`Lead - ${user?.division || ""} Division`}
      navLinks={navLinks}
      showStats={true}
      stats={{
        working: stats?.working || 0,
        completed: stats?.completed || 0,
      }}
    />
  );
}

export default SidebarLead;
