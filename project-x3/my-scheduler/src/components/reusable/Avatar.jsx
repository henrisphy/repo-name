import '../../styles.css';

function Avatar({ name, size = "medium", className = "" }) {
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getSize = () => {
    switch (size) {
      case "small":
        return "avatar-small";
      case "large":
        return "avatar-large";
      default:
        return "avatar-medium";
    }
  };

  return (
    <div className={`avatar ${getSize()} ${className}`}>
      {getInitials(name)}
    </div>
  );
}

export default Avatar;