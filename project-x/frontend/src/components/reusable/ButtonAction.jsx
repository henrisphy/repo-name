import "../../styles.css";

function ButtonActionPositive({
  children,
  onClick,
  type = "button",
  className,
}) {
  return (
    <button
      className={`btn btn-positive ${className || ""}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function ButtonActionNegative({
  children,
  onClick,
  type = "button",
  className,
}) {
  return (
    <button
      className={`btn btn-negative ${className || ""}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export { ButtonActionPositive, ButtonActionNegative };
