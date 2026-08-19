import { Outlet } from "react-router-dom";
import Sidebar from "../../components/reusable/Sidebar";
import { useSelector } from "react-redux";


function DashboardLead() {
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.tasks);

  const navLinks = [
    { path: "/dashboard/lead", label: "Dashboard" },
    { path: "/dashboard/lead/tasks", label: "All Tasks" },
    { path: "/dashboard/lead/create", label: "Create Task" },
    { path: "/dashboard/lead/team", label: "My Team" },
  ];

  return (
    <div className="dashboardLayout">
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
      <main className="dashboardMain">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLead;