import { useState } from "react";
import "./Calendar.css";

function Calendar({ tasks, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y, m) => {
    return new Date(y, m, 1).getDay();
  };

  const getTaskForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return tasks.filter((task) => task.dueDate === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const navigateYear = (direction) => {
    setCurrentDate(new Date(year + direction, month, 1));
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendarDay empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTaskForDate(day);
      const hasTask = dayTasks.length > 0;
      const isToday =
        new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div
          key={day}
          className={`calendarDay ${hasTask ? "hasTask" : ""} ${
            isToday ? "today" : ""
          }`}
          onClick={() =>
            onDateClick &&
            onDateClick(
              `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`
            )
          }
        >
          <span className="dayNumber">{day}</span>
          {hasTask && <span className="taskIndicator">{dayTasks.length}</span>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendarHeader">
        <div className="calendarNav">
          <button onClick={() => navigateYear(-1)}>⟪</button>
          <button onClick={() => navigateMonth(-1)}>‹</button>
          <h3>
            {new Date(year, month).toLocaleString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button onClick={() => navigateMonth(1)}>›</button>
          <button onClick={() => navigateYear(1)}>⟫</button>
        </div>
        <button
          className="btn btn-small"
          onClick={() => setCurrentDate(new Date())}
        >
          Hari Ini
        </button>
      </div>
      <div className="calendarGrid">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day} className="calendarWeekday">
            {day}
          </div>
        ))}
        {renderMonthView()}
      </div>
    </div>
  );
}

export default Calendar;
