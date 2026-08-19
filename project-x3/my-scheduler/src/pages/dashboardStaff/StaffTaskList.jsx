import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import TaskCard from "../../components/reusable/TaskCard";

function StaffTaskList() {
  const context = useOutletContext();
  
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  if (!context) {
    return <div className="loading">Loading...</div>;
  }

  const { userTasks } = context;

  if (!userTasks) {
    return <div className="loading">Loading...</div>;
  }

  const years = [
    "all",
    ...new Set(userTasks.map((t) => t.dueDate?.split("-")[0]).filter(Boolean)),
  ];
  const months = ["all", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  const getMonthName = (month) => {
    const names = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return names[parseInt(month) - 1] || month;
  };

  const sortedTasks = [...userTasks]
    .filter((task) => {
      if (filterStatus === "working" && task.status !== "working") return false;
      if (filterStatus === "completed" && task.status !== "completed") return false;
      return true;
    })
    .filter((task) => {
      if (filterYear !== "all" && task.dueDate) {
        const year = task.dueDate.split("-")[0];
        if (year !== filterYear) return false;
      }
      return true;
    })
    .filter((task) => {
      if (filterMonth !== "all" && task.dueDate) {
        const month = task.dueDate.split("-")[1];
        if (month !== filterMonth) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return sortOrder === "asc"
          ? (a.dueDate || "").localeCompare(b.dueDate || "")
          : (b.dueDate || "").localeCompare(a.dueDate || "");
      }
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sortOrder === "asc"
          ? (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
          : (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return 0;
    });

  const resetFilters = () => {
    setFilterStatus("all");
    setFilterYear("all");
    setFilterMonth("all");
    setSortBy("dueDate");
    setSortOrder("asc");
  };

  return (
    <div>
      <h1>Task List</h1>

      <div className="filterBar">
        <div className="filterGroup">
          <label>Status:</label>
          <button
            className={`filterBtn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All ({userTasks.length})
          </button>
          <button
            className={`filterBtn ${filterStatus === "working" ? "active" : ""}`}
            onClick={() => setFilterStatus("working")}
          >
            Working ({userTasks.filter((t) => t.status === "working").length})
          </button>
          <button
            className={`filterBtn ${filterStatus === "completed" ? "active" : ""}`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed ({userTasks.filter((t) => t.status === "completed").length})
          </button>
        </div>
      </div>

      <div className="filterBar">
        <div className="filterGroup">
          <label>Year:</label>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y === "all" ? "All" : y}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup">
          <label>Month:</label>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All" : getMonthName(m)}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup">
          <label>Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <button className="btn btn-small btn-outline" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>

        <button className="btn btn-small btn-outline" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      <div className="taskList">
        {sortedTasks.length === 0 ? (
          <p className="emptyMessage">No tasks match your filters</p>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              linkTo={`/dashboard/staff/task/${task.id}`}
              showDelete={false}
              meta={[
                `From: ${task.assignedByName}`,
                `Deadline: ${task.dueDate}`,
                `Comments: ${task.comments?.length || 0}`,
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StaffTaskList;