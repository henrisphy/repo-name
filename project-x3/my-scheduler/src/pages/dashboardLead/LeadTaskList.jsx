import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../../features/tasks/taskSlice";
import TaskCard from "../../components/reusable/TaskCard";
import Modal from "../../components/reusable/Modal";
import {
  ButtonActionPositive,
  ButtonActionNegative,
} from "../../components/reusable/ButtonAction";

function LeadTaskList() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [filter, setFilter] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState("");

  const divisionTasks = tasks;

  const years = [
    "all",
    ...new Set(divisionTasks.map((t) => t.dueDate?.split("-")[0]).filter(Boolean)),
  ];
  const months = ["all", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  const getMonthName = (month) => {
    const names = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return names[parseInt(month) - 1] || month;
  };

  const handleDeleteClick = (taskId) => {
    const task = divisionTasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      setSelectedTaskTitle(task.title);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedTaskId) {
      dispatch(deleteTask(selectedTaskId));
      setShowDeleteModal(false);
      setSelectedTaskId(null);
      setSelectedTaskTitle("");
    }
  };

  const filteredTasks = divisionTasks
    .filter((task) => {
      if (filter === "working" && task.status !== "working") return false;
      if (filter === "completed" && task.status !== "completed") return false;
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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const resetFilters = () => {
    setFilter("all");
    setFilterYear("all");
    setFilterMonth("all");
    setSortBy("dueDate");
    setSortOrder("asc");
  };

  return (
    <div>
      <div className="dashboardHeader">
        <h1>All Tasks</h1>
        <Link to="/dashboard/lead/create">
          <ButtonActionPositive type="button">Create New Task</ButtonActionPositive>
        </Link>
      </div>

      <div className="filterBar">
        <div className="filterGroup">
          <label>Status:</label>
          <button
            className={`filterBtn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({divisionTasks.length})
          </button>
          <button
            className={`filterBtn ${filter === "working" ? "active" : ""}`}
            onClick={() => setFilter("working")}
          >
            Working ({divisionTasks.filter((t) => t.status === "working").length})
          </button>
          <button
            className={`filterBtn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed ({divisionTasks.filter((t) => t.status === "completed").length})
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

        <button className="btn btn-outline btn-small" onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>

        <button className="btn btn-outline btn-small" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      <div className="taskList">
        {filteredTasks.length === 0 ? (
          <p className="emptyMessage">No tasks match your filters</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              linkTo={`/dashboard/lead/task/${task.id}`}
              showDelete={true}
              onDelete={handleDeleteClick}
              meta={[
                `Assigned to: ${task.assignedToName}`,
                `Deadline: ${task.dueDate}`,
              ]}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="small"
      >
        <h3 className="modalTitle">Hapus Task</h3>
        <p className="modalBody">
          Apakah Anda yakin ingin menghapus task <strong>"{selectedTaskTitle}"</strong>?
          <br />
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="modalFooter">
          <ButtonActionNegative onClick={() => setShowDeleteModal(false)}>
            Batal
          </ButtonActionNegative>
          <ButtonActionPositive onClick={handleConfirmDelete}>
            Hapus
          </ButtonActionPositive>
        </div>
      </Modal>
    </div>
  );
}

export default LeadTaskList;