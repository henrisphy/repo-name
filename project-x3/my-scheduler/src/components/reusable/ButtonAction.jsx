import '../../styles.css';

function ButtonActionPositive({
  children,
  onClick,
  type = "button",
  className,
  disabled = false,
}) {
  return (
    <button
      className={`btn btn-positive ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
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
  disabled = false,
}) {
  return (
    <button
      className={`btn btn-negative ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function ButtonActionSuccess({
  children,
  onClick,
  type = "button",
  className,
  disabled = false,
}) {
  return (
    <button
      className={`btn btn-success ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function ButtonActionOutline({
  children,
  onClick,
  type = "button",
  className,
  disabled = false,
}) {
  return (
    <button
      className={`btn btn-outline ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export {
  ButtonActionPositive,
  ButtonActionNegative,
  ButtonActionSuccess,
  ButtonActionOutline,
};