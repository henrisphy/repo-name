export const getPriorityLabel = (priority) => {
  const labels = { high: 'High', medium: 'Medium', low: 'Low' };
  return labels[priority] || priority;
};

export const getPriorityColor = (priority) => {
  const classes = {
    high: 'priorityHigh',
    medium: 'priorityMedium',
    low: 'priorityLow',
  };
  return classes[priority] || '';
};

export const getStatusLabel = (status) => {
  const labels = { working: 'Working', completed: 'Completed' };
  return labels[status] || status;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getMonthName = (month) => {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return names[parseInt(month) - 1] || month;
};

export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};