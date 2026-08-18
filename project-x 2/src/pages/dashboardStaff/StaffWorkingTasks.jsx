import { useOutletContext } from "react-router-dom";
import TaskCard from "../../components/reusable/taskCard";

function StaffWorkingTasks() {
  const context = useOutletContext();

  if (!context) {
    return <div className="loading">Loading...</div>;
  }

  const { userTasks } = context;

  if (!userTasks) {
    return <div className="loading">Loading...</div>;
  }

  const workingTasks = userTasks.filter((task) => task.status === "working");

  return (
    <div>
      <h1>Working Tasks</h1>
      <p>Showing {workingTasks.length} tasks in progress</p>

      <div className="taskList">
        {workingTasks.length === 0 ? (
          <p className="emptyMessage">Great job! All tasks are completed.</p>
        ) : (
          workingTasks.map((task) => (
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
                `Deadline: ${task.dueDate}`,
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StaffWorkingTasks;
