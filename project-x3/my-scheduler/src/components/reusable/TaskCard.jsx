import { Link } from "react-router-dom";
import { ButtonActionNegative } from "./ButtonAction";
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
  showDelete = false,
  onDelete,
}) {
  const CardWrapper = linkTo ? Link : "div";
  const props = linkTo
    ? { to: linkTo, className: `taskCard ${className}` }
    : { className: `taskCard ${className}`, onClick };

  const getStatusLabel = (status) => {
    const labels = { working: "Working", completed: "Completed" };
    return labels[status] || status || "Unknown";
  };

  const getPriorityLabel = (priority) => {
    const labels = { high: "High", medium: "Medium", low: "Low" };
    return labels[priority] || priority || "";
  };

  const getPriorityClass = (priority) => {
    const classes = {
      high: "priorityHigh",
      medium: "priorityMedium",
      low: "priorityLow",
    };
    return classes[priority] || "";
  };

  const truncateText = (text, wordLimit = 50) => {
    if (!text) return null;
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const formatDescription = (text) => {
    if (!text) return null;
    const truncated = truncateText(text, 50);
    return truncated.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const statusLabel = getStatusLabel(status);
  const priorityLabel = getPriorityLabel(priority);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
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
          {showDelete && (
            <ButtonActionNegative className="btn-small" onClick={handleDelete}>
              Hapus
            </ButtonActionNegative>
          )}
        </div>
      </div>
      <div className="taskCardBody">
        {description && (
          <p
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: "0 0 8px 0",
              lineHeight: "1.6",
            }}
          >
            {formatDescription(description)}
          </p>
        )}
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
