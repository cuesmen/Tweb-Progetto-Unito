import React from "react";
import {
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiX,
} from "react-icons/fi";

const TYPE_MAP = {
  error: {
    icon: FiXCircle,
    label: "Error",
    tone: "#ff6b6b",
  },
  warning: {
    icon: FiAlertTriangle,
    label: "Warning",
    tone: "#ffd166",
  },
  info: {
    icon: FiInfo,
    label: "Info",
    tone: "#9ecbff",
  },
  success: {
    icon: FiCheckCircle,
    label: "Success",
    tone: "#7bd88f",
  },
};

const normalizeType = (t) => {
  const key = String(t || "info").toLowerCase();
  if (["danger", "fail"].includes(key)) return "error";
  if (["warn"].includes(key)) return "warning";
  if (["ok", "done"].includes(key)) return "success";
  return ["error", "warning", "info", "success"].includes(key) ? key : "info";
};

export default function Alert({
  type = "info",
  title,
  description,
  children,
  icon,                 
  dismissible = false,   
  onClose,               
  compact = false,      
  className = "",
  id,
  ...rest
}) {
  const t = normalizeType(type);
  const { icon: DefaultIcon, label, tone } = TYPE_MAP[t];
  const Icon = icon || DefaultIcon;

  const ariaLive = t === "error" ? "assertive" : "polite";

  return (
    <div
      id={id}
      role="alert"
      aria-live={ariaLive}
      className={`alert alert--${t} ${compact ? "alert--compact" : ""} ${
        dismissible ? "alert--dismissible" : ""
      } ${className}`}
      style={{ "--alert-tone": tone }}
      {...rest}
    >
      <div className="alert__halo" aria-hidden="true" />
      <div className="alert__icon" aria-hidden="true">
        <Icon className="alert__icon-svg" />
      </div>

      <div className="alert__content">
        {title && (
          <div className="alert__title">
            <span className="alert__title-gradient">{title}</span>
          </div>
        )}
        {(description || children) && (
          <div className="alert__desc">
            {description || children}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          className="alert__close glass-pill"
          onClick={onClose}
          aria-label="Close alert"
        >
          <FiX className="btn-icon" />
        </button>
      )}
    </div>
  );
}
