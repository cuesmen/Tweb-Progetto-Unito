import { useCallback, useEffect, useMemo, useState } from "react";
import ChatMessage from "../../models/ChatMessage";

/**
 * Hook to manage chat messages for a room (global or movie-specific) with pagination and socket updates.
 * Room formats:
 *  - "global"
 *  - `movie:${movieId}`
 * @module useChatRoom
 * @category API
 * @param {string} room
 * @param {Object} [options]
 * @param {number} [options.pageSize]
 * @param {Object|null} [options.socket] socket.io-client instance
 */
export function useChatRoom(room, { pageSize = 20, socket = null } = {}) {
  const isGlobal = room === "global";
  const movieId = useMemo(
    () => (isGlobal ? null : room?.startsWith("movie:") ? room.slice(6) : null),
    [room]
  );

  const [messages, setMessages] = useState([]); // newest to oldest
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // reset if room changes
  useEffect(() => {
    setMessages([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
  }, [room]);

  // join/leave socket room
  useEffect(() => {
    if (!socket || !room) return;
    socket.emit("chat:join", room);
    const onIncoming = (msg) => {
      const m = ChatMessage.fromApi(msg);
      setMessages((prev) => {
        const exists = m.id && prev.some((p) => p.id === m.id);
        return exists ? prev : [m, ...prev];
      });
    };
    socket.on("chat:message", onIncoming);

    return () => {
      socket.off("chat:message", onIncoming);
      socket.emit("chat:leave", room);
    };
  }, [socket, room]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !room || !socket) return;
    setLoading(true);
    setError(null);

    socket.emit(
      "chat:list",
      { room, limit: pageSize, cursor, movieId },
      (res) => {
        setLoading(false);
        if (!res || res.error) {
          setError(res?.error || new Error("LIST_ERROR"));
          return;
        }
        const items = Array.isArray(res?.items)
          ? res.items.map(ChatMessage.fromApi)
          : [];
        setMessages((prev) => {
          const merged = [...prev, ...items];
          const seen = new Set();
          const deduped = [];
          for (const msg of merged) {
            const key = msg.id || `${msg.username}-${msg.createdAt?.getTime?.()}`;
            if (seen.has(key)) continue;
            seen.add(key);
            deduped.push(msg);
          }
          return deduped;
        });
        setCursor(res?.nextCursor ?? null);
        setHasMore(Boolean(res?.hasMore));
      }
    );
  }, [cursor, hasMore, loading, movieId, pageSize, room, socket]);

  // bootstrap first load
  useEffect(() => {
    loadMore();
  }, [room, loadMore]);

  const send = useCallback(
    ({ username, text, senderId }) =>
      new Promise((resolve, reject) => {
        if (!room || !socket) {
          const err = new Error("Socket not connected");
          setError(err);
          return reject(err);
        }
        setSending(true);
        setError(null);
        socket.emit(
          "chat:message",
          { room, movieId, username, text, senderId },
          (res) => {
            setSending(false);
            if (!res || res.error) {
              const e = res?.error || new Error("SEND_ERROR");
              setError(e);
              return reject(e);
            }
            const saved = ChatMessage.fromApi(res);
            setMessages((prev) => {
              const exists = saved.id && prev.some((p) => p.id === saved.id);
              return exists ? prev : [saved, ...prev];
            });
            resolve(saved);
          }
        );
      }),
    [room, movieId, socket]
  );

  return {
    messages, // array ChatMessage (newest → oldest)
    hasMore,
    loading,
    sending,
    error,
    loadMore,
    send,
  };
}
