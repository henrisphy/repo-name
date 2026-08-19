import { useEffect } from "react";
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
            className="modalClose"
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