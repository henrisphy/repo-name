import { forwardRef } from "react";
import "../../styles.css";

const InputField = forwardRef(function InputField(
  {
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    onKeyDown,
    error,
    required = false,
    name,
    id,
    rows = 3,
    children,
    className = "",
  },
  ref
) {
  const baseClass = `inputField ${error ? "inputError" : ""} ${className}`;

  return (
    <div className="inputGroup">
      {label && (
        <label className="inputLabel" htmlFor={id || name}>
          {label}
          {required && <span className="requiredStar">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={id || name}
          name={name}
          className={baseClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          required={required}
          rows={rows}
          ref={ref}
        />
      ) : type === "select" ? (
        <select
          id={id || name}
          name={name}
          className={baseClass}
          value={value}
          onChange={onChange}
          required={required}
          ref={ref}
        >
          {children}
        </select>
      ) : (
        <input
          id={id || name}
          name={name}
          className={baseClass}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          required={required}
          ref={ref}
        />
      )}

      {error && <p className="errorText">{error}</p>}
    </div>
  );
});

export default InputField;