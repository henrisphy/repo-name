import { useSelector } from "react-redux";
import StatCard from "../../components/reusable/StatCard";
import TaskCard from "../../components/reusable/TaskCard";

function LeadDashboardOverview() {
  const { user } = useSelector((state) => state.auth);
  const { tasks, stats } = useSelector((state) => state.tasks);
  const { team } = useSelector((state) => state.users);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      <div className="statsGrid">
        <StatCard label="Total Tasks" value={stats.total || 0} />
        <StatCard label="Working" value={stats.working || 0} color="var(--warning)" />
        <StatCard label="Completed" value={stats.completed || 0} color="var(--success)" />
        <StatCard label="My Staffs" value={team.length || 0} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <h2>Recent Tasks</h2>
        <div className="taskList">
          {tasks.slice(0, 5).map((task) => (
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