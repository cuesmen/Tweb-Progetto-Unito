import { memo } from "react";

const timeFormatter = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
});

function ChatMessage({ message, isSelf }) {
  const displayAuthor = message?.author?.trim() || "Anonimo";
  const timestamp = message?.timestamp ?? Date.now();
  const timeLabel = timeFormatter.format(timestamp);
  const lines = (message?.text || "").split(/\r?\n/);

  return (
    <li
      className={`film-chat__message${isSelf ? " is-self" : ""}`}
      aria-label={`${displayAuthor} alle ${timeLabel}`}
    >
      <article className="film-chat__bubble" tabIndex={-1}>
        <div className="film-chat__author">
          <span>{isSelf ? "Tu" : displayAuthor}</span>
          <span className="film-chat__time">{timeLabel}</span>
        </div>
        <div className="film-chat__content">
          {lines.map((line, index) => (
            <span key={index}>
              {line || "\u00A0"}
              {index < lines.length - 1 && <br />}
            </span>
          ))}
        </div>
      </article>
    </li>
  );
}

export default memo(ChatMessage);
