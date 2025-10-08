import "../css/components.css";
import React from "react";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  iconRight,
  onIconClick,
  inputProps = {},
}) {
  const hasIcon = Boolean(iconRight);
  const clickable = Boolean(onIconClick);

  return (
    <div className={`input-field${hasIcon ? " with-icon" : ""}${clickable ? " with-icon-click" : ""}`}>
      <label>
        {label}
        <div className="input-wrapper">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`input${hasIcon ? " has-icon" : ""}`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
            {...inputProps}
          />

          {hasIcon && (
            clickable ? (
              <button
                type="button"
                className="icon-right-btn"
                aria-label="action"
                onClick={onIconClick}
              >
                {iconRight}
              </button>
            ) : (
              <span className="icon-right" aria-hidden="true">
                {iconRight}
              </span>
            )
          )}
        </div>
      </label>
    </div>
  );
}
