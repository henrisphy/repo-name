import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Calendar from "../../components/Calendar";
import TaskCard from "../../components/reusable/taskCard";

function StaffCalendar() {
  const context = useOutletContext();

  if (!context) {
    return <div className="loading">Loading...</div>;
  }

  const { userTasks } = context;

  if (!userTasks) {
    return <div className="loading">Loading...</div>;
  }

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const tasks = userTasks.filter((task) => task.dueDate === date);
    setSelectedDateTasks(tasks);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <div className="calendarContainer">
        <Calendar tasks={userTasks} onDateClick={handleDateClick} />

        {selectedDate && (
          <div className="selectedDateTasks">
            <h3>Tasks for {selectedDate}</h3>
            {selectedDateTasks.length === 0 ? (
              <p className="emptyMessage">No tasks on this date</p>
            ) : (
              selectedDateTasks.map((task) => (
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
        )}
      </div>
    </div>
  );
}

export default StaffCalendar;
