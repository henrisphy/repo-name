import { useAuth } from "../../contexts/AuthContext";
import { useTasks } from "../../contexts/TaskContext";
import StatCard from "../../components/reusable/statCard";
import TaskCard from "../../components/reusable/taskCard";

function LeadDashboardOverview() {
  const { user, getTeamStaff } = useAuth();
  const { getTasksByDivision, getTaskStats } = useTasks();
  const staff = getTeamStaff();
  const stats = getTaskStats(user?.division);
  const divisionTasks = getTasksByDivision(user?.division || "");

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      <div className="statsGrid">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard
          label="Working"
          value={stats.working}
          color="var(--warning)"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="var(--success)"
        />
        <StatCard label="My Staffs" value={staff.length} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <h2>Recent Tasks</h2>
        <div className="taskList">
          {divisionTasks.slice(0, 5).map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              linkTo={`/dashboard/lead/task/${task.id}`}
              meta={[
                `Assigned to: ${task.assignedToName}`,
                `Deadline: ${task.dueDate}`,
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeadDashboardOverview;
