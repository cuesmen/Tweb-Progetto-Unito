import axiosClient from "../axiosClient";
import ChatMessage from "../../models/ChatMessage";
import ChatMeta from "../../models/ChatMeta";

const okOrThrow = (res) => {
  const data = res?.data;
  if (!data?.ok) {
    const msg = data?.error?.message || "API Error";
    const err = new Error(msg);
    err.code = data?.error?.code || "API_ERROR";
    err.status = res?.status;
    throw err;
  }
  return data;
};

const mapList = (payload) => ({
  items: Array.isArray(payload?.items) ? payload.items.map(ChatMessage.fromApi) : [],
  nextCursor: payload?.nextCursor ?? null,
  hasMore: !!payload?.hasMore,
});

export const chatService = {
  // ---------- Health ----------
  async health({ signal } = {}) {
    const res = await axiosClient.get("/chat/health", { signal });
    return okOrThrow(res).data;
  },

  // ---------- Global chat ----------
  async listGlobal({ limit = 20, cursor = null, signal } = {}) {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const res = await axiosClient.get("/chat/global/messages", { params, signal });
    return mapList(okOrThrow(res).data);
  },

  async sendGlobal({ username, text }, { signal } = {}) {
    const res = await axiosClient.post("/chat/global/messages", { username, text }, { signal });
    const payload = okOrThrow(res).data?.message;
    return ChatMessage.fromApi(payload);
  },

  // ---------- Movie chat ----------
  async listByMovie(movieId, { limit = 20, cursor = null, signal } = {}) {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const movie = String(movieId); // coerciamo (da long/number) a string
    const res = await axiosClient.get(`/chat/movie/${encodeURIComponent(movie)}/messages`, { params, signal });
    return mapList(okOrThrow(res).data);
  },

  async sendToMovie(movieId, { username, text }, { signal } = {}) {
    const movie = String(movieId);
    const res = await axiosClient.post(
      `/chat/movie/${encodeURIComponent(movie)}/messages`,
      { username, text },
      { signal }
    );
    const payload = okOrThrow(res).data?.message;
    return ChatMessage.fromApi(payload);
  },

  async getMovieMeta(movieId, { signal } = {}) {
    const movie = String(movieId);
    const res = await axiosClient.get(`/chat/movie/${encodeURIComponent(movie)}`, { signal });
    const raw = okOrThrow(res).data;
    return raw ? ChatMeta.fromApi(raw) : null;
  },
};
