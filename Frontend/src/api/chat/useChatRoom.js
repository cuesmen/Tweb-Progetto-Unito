import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatService } from "./chatService";
import ChatMessage from "../../models/ChatMessage";

/**
 * room:
 *  - "global"
 *  - `movie:${movieId}`
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

  const abortRef = useRef(null);

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
      setMessages((prev) => [m, ...prev]);
    };
    socket.on("chat:message", onIncoming);

    return () => {
      socket.off("chat:message", onIncoming);
      socket.emit("chat:leave", room);
    };
  }, [socket, room]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !room) return;
    setLoading(true);
    setError(null);

    // if there is a previous request ongoing, cancel it
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let page;
      if (isGlobal) {
        page = await chatService.listGlobal({
          limit: pageSize,
          cursor,
          signal: controller.signal,
        });
      } else {
        page = await chatService.listByMovie(movieId, {
          limit: pageSize,
          cursor,
          signal: controller.signal,
        });
      }
      setMessages((prev) => [...prev, ...page.items]); // append at the end (oldest)
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (e) {
      if (
        e?.code === "ERR_CANCELED" ||
        e?.name === "CanceledError" ||
        e?.message === "canceled"
      )
        return;
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [isGlobal, movieId, pageSize, cursor, hasMore, loading, room]);

  // bootstrap first load
  useEffect(() => {
    loadMore(); /* eslint-disable-next-line */
  }, [room]);

  const send = useCallback(
    async ({ username, text }) => {
      if (!room) return null;
      setSending(true);
      setError(null);

      const controller = new AbortController();

      try {
        const saved = isGlobal
          ? await chatService.sendGlobal(
              { username, text },
              { signal: controller.signal }
            )
          : await chatService.sendToMovie(
              movieId,
              { username, text },
              { signal: controller.signal }
            );

        if (!socket) setMessages((prev) => [saved, ...prev]);

        return saved;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setSending(false);
      }
    },
    [room, isGlobal, movieId, socket]
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
