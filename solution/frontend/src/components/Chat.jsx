import { useEffect, useMemo, useRef, useState } from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";

import { io } from "socket.io-client";
import { useChatRoom } from "../api/chat/useChatRoom";

import ChatMessage from "./ChatMessage";
import Alert from "./Alert";

const mapErrorMessage = (err) => {
  const raw = err?.message || err?.error || String(err || "");
  if (/xhr poll error/i.test(raw)) {
    return "Cannot reach chat server (polling). Ensure it is running and reachable.";
  }
  if (/connect/i.test(raw) && /refused/i.test(raw)) {
    return "Chat connection refused: check the server is running.";
  }
  return raw || "Unknown chat error.";
};

const defaultIntro = (title) =>
  title ? `Benvenuto nella chat dedicata a “${title}”. Condividi quello che pensi!` : null;

export default function Chat({
  room,
  title,
  subtitle,
  introText,
  introAuthor = "MovieBot",
  socketUrl = "http://localhost:4000",
  className = "",
  usernamePlaceholder = "Il tuo nome (min 3 caratteri)",
  messagePlaceholder = "Scrivi un messaggio…",
  emptyLabel = "Ancora nessun messaggio. Inizia tu la conversazione.",
  sendLabel = "Invia",
  cooldownMs = 0,
  storageKeyPrefix = "chat:lastSentAt",
}) {
  const socketRef = useRef(null);
  const sessionIdRef = useRef(`session-${Math.random().toString(36).slice(2)}`);
  const messageListRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // socket.io connect/disconnect 
  useEffect(() => {
    if (!room) return undefined;
    const socket = io(socketUrl, { withCredentials: true });
    const onConnectError = (err) => setErrorMsg(mapErrorMessage(err) || "Socket connection failed");
    const onError = (err) => setErrorMsg(mapErrorMessage(err) || "Socket error");
    const onConnect = () => setErrorMsg(null);
    socket.on("connect_error", onConnectError);
    socket.on("error", onError);
    socket.on("connect", onConnect);
    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socket.off("connect_error", onConnectError);
      socket.off("error", onError);
      socket.off("connect", onConnect);
    };
  }, [room, socketUrl]);

  const { messages, send, hasMore, loadMore, loading, sending, error: chatError } = useChatRoom(room, {
    socket: socketRef.current,
  });

  useEffect(() => {
    if (!chatError) return;
    setErrorMsg(mapErrorMessage(chatError));
  }, [chatError]);

  const [username, setUsername] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [lastSentAt, setLastSentAt] = useState(() => {
    const key = `${storageKeyPrefix}:${room}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 0;
  });
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  // keep view pinned to the newest messages (top of the list)
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: "smooth" });
  }, [messages]);

  const trimmedName = username.trim();
  const trimmedText = messageBody.trim();
  const nameValid = trimmedName.length >= 3;
  const textValid = trimmedText.length >= 3;
  const remainingMs = cooldownMs > 0 ? Math.max(0, cooldownMs - (now - lastSentAt)) : 0;
  const remainingSec = Math.ceil(remainingMs / 1000);
  const canSend = nameValid && textValid && remainingMs === 0 && !sending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    try {
      await send({ username: trimmedName, text: trimmedText, senderId: sessionIdRef.current });
      setMessageBody("");
      const ts = Date.now();
      setLastSentAt(ts);
      localStorage.setItem(`${storageKeyPrefix}:${room}`, String(ts));
    } catch (err) {
      console.error("Send failed:", err);
      setErrorMsg(mapErrorMessage(err) || "Send failed");
    }
  };

  const introMessage = useMemo(() => {
    const text = introText ?? defaultIntro(title);
    if (!text) return null;
    // return a system intro message
    return {
      id: "intro",
      author: introAuthor,
      text,
      timestamp: Date.now(),
      senderId: "system",
    };
  }, [introAuthor, introText, title]);

  const allMessages = useMemo(
    () => (introMessage ? [introMessage, ...messages] : messages),
    [introMessage, messages]
  );

  const participantsCount = useMemo(() => {
    const names = new Set(messages.map((m) => m.username?.trim?.() || "Guest"));
    return names.size;
  }, [messages]);

  const rootClass = ["film-chat", className].filter(Boolean).join(" ");

  return (
    <section className={rootClass} aria-labelledby="chat-title">
      {errorMsg && (
        <Alert
          type="error"
          title="Chat"
          description={errorMsg}
          dismissible
          className="film-chat__alert"
        />
      )}
      <header className="film-chat__header">
        <div>
          <h2 id="chat-title" className="film-chat__title">{title}</h2>
          {subtitle && <p className="film-chat__subtitle">{subtitle}</p>}
        </div>
        <span className="film-chat__counter" aria-live="polite">
          💬 {messages.length} messages · 👥 {participantsCount} partecipants
        </span>
      </header>

      <div className="film-chat__messages" ref={messageListRef} aria-live="polite">
        {messages.length === 0 ? (
          <div className="film-chat__empty">{emptyLabel}</div>
        ) : (
          <ul className="film-chat__list">
            {allMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={{
                  author: msg.username || msg.author || "Anonimo",
                  text: msg.text,
                  timestamp: msg.createdAt || msg.timestamp,
                }}
                isSelf={msg.senderId === sessionIdRef.current}
              />
            ))}
          </ul>
        )}
        {hasMore && !loading && (
          <button className="film-chat__loadmore" onClick={loadMore}>
            Load oldest messages
          </button>
        )}
        {loading && <div className="film-chat__loading">Caricamento...</div>}
      </div>

      <form className="film-chat__form" onSubmit={handleSubmit} noValidate>
        <div className="film-chat__row">
          <input
            id="chat-username"
            className={`film-chat__input ${username && !nameValid ? "is-invalid" : ""}`}
            type="text"
            maxLength={32}
            placeholder={usernamePlaceholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <small className="film-chat__help">
            {username && !nameValid ? "Minimo 3 caratteri" : "\u00A0"}
          </small>
        </div>

        <textarea
          id="chat-message"
          className={`film-chat__textarea ${messageBody && !textValid ? "is-invalid" : ""}`}
          placeholder={messagePlaceholder}
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          maxLength={800}
        />
        <small className="film-chat__help">
          {messageBody && !textValid ? "Minimo 3 caratteri" : "\u00A0"}
        </small>

        <div className="film-chat__actions">
          <span className="film-chat__hint">
            {remainingMs > 0
              ? `Waiting time ${remainingSec}s`
              : "Send with Enter · Shift+Enter for newline"}
          </span>
          <button className="film-chat__button" type="submit" disabled={!canSend}>
            <IoPaperPlaneOutline />
            {remainingMs > 0 ? `Attendi ${remainingSec}s` : sendLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
