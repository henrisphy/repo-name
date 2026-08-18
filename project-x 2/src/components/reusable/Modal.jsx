import { useEffect } from "react";
import { ButtonActionNegative } from "./ButtonAction";
import "../../styles.css";

function Modal({
  isOpen,
  onClose,
  children,
  size = "medium",
  showClose = true,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "modalSmall";
      case "large":
        return "modalLarge";
      case "full":
        return "modalFull";
      default:
        return "modalMedium";
    }
  };

  return (
    <div
      className="modalOverlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modalContent ${getSizeClass()}`}>
        {showClose && (
          <button
            onClick={onClose}
            className="modalCloseBtn"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "none",
              background: "var(--warning)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
