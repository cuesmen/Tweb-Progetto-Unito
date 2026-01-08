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

/**
 * Chat service client for global and movie rooms.
 * @module api/chat/chatService
 * @category API
 */
export const chatService = {
  /**
   * Checks chat service health.
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} health payload
   */
  async health({ signal } = {}) {
    const res = await axiosClient.get("/chat/health", { signal });
    return okOrThrow(res).data;
  },

  /**
   * Lists global chat messages with cursor pagination.
   * @param {Object} [options]
   * @param {number} [options.limit]
   * @param {string|null} [options.cursor]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<Object>} page with items/nextCursor/hasMore
   */
  async listGlobal({ limit = 20, cursor = null, signal } = {}) {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const res = await axiosClient.get("/chat/global/messages", { params, signal });
    return mapList(okOrThrow(res).data);
  },

  /**
   * Sends a message to the global chat.
   * @param {{username: string, text: string}} payload
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<Object>} ChatMessage
   */
  async sendGlobal({ username, text }, { signal } = {}) {
    const res = await axiosClient.post("/chat/global/messages", { username, text }, { signal });
    const payload = okOrThrow(res).data?.message;
    return ChatMessage.fromApi(payload);
  },

  /**
   * Lists messages for a movie-specific chat.
   * @param {string|number} movieId
   * @param {Object} [options]
   * @param {number} [options.limit]
   * @param {string|null} [options.cursor]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<Object>} page with items/nextCursor/hasMore
   */
  async listByMovie(movieId, { limit = 20, cursor = null, signal } = {}) {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const movie = String(movieId); // long/number to string conversion
    const res = await axiosClient.get(`/chat/movie/${encodeURIComponent(movie)}/messages`, { params, signal });
    return mapList(okOrThrow(res).data);
  },

  /**
   * Sends a message to a movie chat.
   * @param {string|number} movieId
   * @param {{username: string, text: string}} payload
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<Object>} ChatMessage
   */
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

  /**
   * Fetches metadata (participants/count) for a movie chat.
   * @param {string|number} movieId
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<Object|null>} ChatMeta or null
   */
  async getMovieMeta(movieId, { signal } = {}) {
    const movie = String(movieId);
    const res = await axiosClient.get(`/chat/movie/${encodeURIComponent(movie)}`, { signal });
    const raw = okOrThrow(res).data;
    return raw ? ChatMeta.fromApi(raw) : null;
  },
};
