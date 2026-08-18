import { Link } from "react-router-dom";
import "../../styles.css";

function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  meta = [],
  linkTo,
  onClick,
  className = "",
  unreadCount = 0,
  statusLabels = {
    working: "Working",
    completed: "Completed",
  },
  priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low",
  },
}) {
  const CardWrapper = linkTo ? Link : "div";
  const props = linkTo
    ? { to: linkTo, className: `taskCard ${className}` }
    : { className: `taskCard ${className}`, onClick };

  const statusLabel = statusLabels[status] || status || "Unknown";
  const priorityLabel = priorityLabels[priority] || priority || "";

  const getPriorityClass = (priority) => {
    const classes = {
      high: "priorityHigh",
      medium: "priorityMedium",
      low: "priorityLow",
    };
    return classes[priority] || "";
  };

  return (
    <CardWrapper {...props}>
      <div className="taskCardHeader">
        <h4>{title}</h4>
        <div className="taskCardBadges">
          {unreadCount > 0 && (
            <span className="unreadBadge">{unreadCount}</span>
          )}
          <span className={`statusBadge ${status}`}>{statusLabel}</span>
          {priority && (
            <span className={`priorityBadge ${getPriorityClass(priority)}`}>
              {priorityLabel}
            </span>
          )}
        </div>
      </div>
      <div className="taskCardBody">
        {description && <p>{description}</p>}
        {meta.length > 0 && (
          <div className="taskCardMeta">
            {meta.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        )}
      </div>
    </CardWrapper>
  );
}

export default TaskCard;
