import { Outlet } from "react-router-dom";
import SidebarLead from "../../components/SidebarLead";
import "./DashboardLead.css";

function DashboardLead() {
  return (
    <div className="dashboardLayout">
      <SidebarLead />
      <main className="dashboardMain">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLead;
