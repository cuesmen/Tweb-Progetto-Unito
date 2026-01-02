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
  const movieId = useMemo(() => (isGlobal ? null : room?.startsWith("movie:") ? room.slice(6) : null), [room]);

  const [messages, setMessages] = useState([]);   // dal più nuovo al più vecchio
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  // reset quando cambia room
  useEffect(() => {
    setMessages([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
  }, [room]);

  // join/leave socket room (se socket presente)
  useEffect(() => {
    if (!socket || !room) return;
    socket.emit("chat:join", room);
    const onIncoming = (msg) => {
      // append in testa (timeline discendente)
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

    // cancel request precedente se presente
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let page;
      if (isGlobal) {
        page = await chatService.listGlobal({ limit: pageSize, cursor, signal: controller.signal });
      } else {
        page = await chatService.listByMovie(movieId, { limit: pageSize, cursor, signal: controller.signal });
      }
      setMessages((prev) => [...prev, ...page.items]);  // append in coda (stiamo scorrendo verso più vecchi)
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (e) {
      if (e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || e?.message === "canceled") return;
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [isGlobal, movieId, pageSize, cursor, hasMore, loading, room]);

  // bootstrap prima pagina
  useEffect(() => { loadMore(); /* eslint-disable-next-line */ }, [room]);

  const send = useCallback(async ({ username, text }) => {
    if (!room) return null;
    setSending(true);
    setError(null);

    // opzionale: Abort per send (di rado serve)
    const controller = new AbortController();

    try {
      const saved = isGlobal
        ? await chatService.sendGlobal({ username, text }, { signal: controller.signal })
        : await chatService.sendToMovie(movieId, { username, text }, { signal: controller.signal });

      // NB: il realtime arriverà comunque via socket se presente.
      // Per UX immediata (senza socket), facciamo anche un prepend ottimistico:
      if (!socket) setMessages((prev) => [saved, ...prev]);

      return saved;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setSending(false);
    }
  }, [room, isGlobal, movieId, socket]);

  return {
    messages,          // array ChatMessage (nuovi → vecchi)
    hasMore,
    loading,
    sending,
    error,
    loadMore,
    send,
  };
}
