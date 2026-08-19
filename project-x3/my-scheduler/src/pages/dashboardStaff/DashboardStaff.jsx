import { Outlet } from "react-router-dom";
import Sidebar from "../../components/reusable/Sidebar";
import { useSelector } from "react-redux";
import "./DashboardStaff.css";

function DashboardStaff() {
  const { user } = useSelector((state) => state.auth);
  const { userTasks } = useSelector((state) => state.tasks);

  const workingCount = userTasks.filter((t) => t.status === "working").length;
  const completedCount = userTasks.filter((t) => t.status === "completed").length;

  const navLinks = [
    { path: "/dashboard/staff", label: "Calendar" },
    { path: "/dashboard/staff/tasks", label: "Task List" },
    { path: "/dashboard/staff/working", label: "Working" },
    { path: "/dashboard/staff/completed", label: "Completed" },
  ];

  return (
    <div className="dashboardLayout">
      <Sidebar
        title={user?.name || "Staff"}
        subtitle={`${user?.division || ""} Division`}
        navLinks={navLinks}
        showStats={true}
        stats={{
          working: workingCount,
          completed: completedCount,
        }}
      />
      <main className="dashboardMain">
        <Outlet context={{ userTasks }} />
      </main>
    </div>
  );
}

export default DashboardStaff;