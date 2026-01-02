import { useEffect, useMemo, useRef, useState } from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { io } from "socket.io-client";
import FilmChatMessage from "./FilmChatMessage";
import { useChatRoom } from "../../api/chat/useChatRoom";

const COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = "filmChat:lastSentAt";

const makeIntroMessage = (movieTitle) => ({
  id: "intro",
  author: "MovieBot",
  text: movieTitle
    ? `Benvenuto nella chat dedicata a “${movieTitle}”. Condividi quello che pensi!`
    : "Benvenuto nella chat del film. Condividi quello che pensi!",
  timestamp: Date.now(),
  senderId: "system",
});

export default function FilmChat({ movie }) {
  const room = `movie:${movie.id}`;
  const socketRef = useRef(null);
  const sessionIdRef = useRef(`session-${Math.random().toString(36).slice(2)}`);
  const messageListRef = useRef(null);

  // --- socket.io ---
  useEffect(() => {
    const socket = io("http://localhost:4000", { withCredentials: true });
    socket.emit("chat:join", room);
    socketRef.current = socket;
    return () => {
      socket.emit("chat:leave", room);
      socket.disconnect();
    };
  }, [room]);

  // --- hook chat (axios + socket) ---
  const { messages, send, hasMore, loadMore, loading, sending } = useChatRoom(room, {
    socket: socketRef.current,
  });

  // --- username, input e cooldown ---
  const [username, setUsername] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [lastSentAt, setLastSentAt] = useState(() => {
    const saved = localStorage.getItem(LAST_SENT_KEY);
    return saved ? Number(saved) : 0;
  });
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  // --- autoscroll quando arrivano messaggi ---
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // --- validazioni ---
  const trimmedName = username.trim();
  const trimmedText = messageBody.trim();
  const nameValid = trimmedName.length >= 3;
  const textValid = trimmedText.length >= 3;
  const remainingMs = 0;
  const remainingSec = Math.ceil(remainingMs / 1000);
  const canSend = nameValid && textValid && remainingMs === 0 && !sending;

  // --- submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    try {
      await send({ username: trimmedName, text: trimmedText });
      setMessageBody("");
      const ts = Date.now();
      setLastSentAt(ts);
      localStorage.setItem(LAST_SENT_KEY, String(ts));
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // --- intro + participants ---
  const introMessage = useMemo(() => makeIntroMessage(movie?.name), [movie?.name]);
  const allMessages = useMemo(() => [introMessage, ...messages], [introMessage, messages]);
  const participantsCount = useMemo(() => {
    const names = new Set(
      messages.map((m) => m.username?.trim?.() || "Guest")
    );
    return names.size;
  }, [messages]);

  return (
    <section className="film-chat" aria-labelledby="film-chat-title">
      <header className="film-chat__header">
        <div>
          <h2 id="film-chat-title" className="film-chat__title">Chat del film</h2>
          <p className="film-chat__subtitle">
            Confrontati con altri fan su {movie?.name ? `“${movie.name}”` : "questo titolo"}
          </p>
        </div>
        <span className="film-chat__counter" aria-live="polite">
          💬 {messages.length} messaggi · 👥 {participantsCount} partecipanti
        </span>
      </header>

      <div className="film-chat__messages" ref={messageListRef} aria-live="polite">
        {messages.length === 0 ? (
          <div className="film-chat__empty">
            Ancora nessun messaggio. Inizia tu la conversazione.
          </div>
        ) : (
          <ul className="film-chat__list">
            {allMessages.map((msg) => (
              <FilmChatMessage
                key={msg.id}
                message={{
                  author: msg.username || msg.author || "Anonimo",
                  text: msg.text,
                  timestamp: msg.createdAt || msg.timestamp,
                }}
                isSelf={false}
              />
            ))}
          </ul>
        )}
        {hasMore && !loading && (
          <button className="film-chat__loadmore" onClick={loadMore}>
            Carica messaggi precedenti
          </button>
        )}
        {loading && <div className="film-chat__loading">Caricamento...</div>}
      </div>

      <form className="film-chat__form" onSubmit={handleSubmit} noValidate>
        <div className="film-chat__row">
          <input
            id="film-chat-username"
            className={`film-chat__input ${username && !nameValid ? "is-invalid" : ""}`}
            type="text"
            maxLength={32}
            placeholder="Il tuo nome (min 3 caratteri)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <small className="film-chat__help">
            {username && !nameValid ? "Minimo 3 caratteri" : "\u00A0"}
          </small>
        </div>

        <textarea
          id="film-chat-message"
          className={`film-chat__textarea ${messageBody && !textValid ? "is-invalid" : ""}`}
          placeholder="Scrivi un pensiero o una curiosità sul film…"
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
              ? `Puoi inviare tra ${remainingSec}s`
              : "Invia con Enter · a capo con Shift+Enter"}
          </span>
          <button className="film-chat__button" type="submit" disabled={!canSend}>
            <IoPaperPlaneOutline />
            {remainingMs > 0 ? `Attendi ${remainingSec}s` : "Invia"}
          </button>
        </div>
      </form>
    </section>
  );
}
