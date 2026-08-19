import { useOutletContext } from "react-router-dom";
import TaskCard from "../../components/reusable/TaskCard";

function StaffCompletedTasks() {
  const context = useOutletContext();

  if (!context) {
    return <div className="loading">Loading...</div>;
  }

  const { userTasks } = context;

  if (!userTasks) {
    return <div className="loading">Loading...</div>;
  }

  const completedTasks = userTasks.filter((task) => task.status === "completed");

  return (
    <div>
      <h1>Completed Tasks</h1>
      <p>Showing {completedTasks.length} completed tasks</p>

      <div className="taskList">
        {completedTasks.length === 0 ? (
          <p className="emptyMessage">No completed tasks yet</p>
        ) : (
          completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              linkTo={`/dashboard/staff/task/${task.id}`}
              meta={[
                `From: ${task.assignedByName}`,
                `Completed: ${task.completedAt}`,
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StaffCompletedTasks;