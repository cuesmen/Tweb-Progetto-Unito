/**
 * Chat metadata domain model.
 * @module ChatMeta
 * @category Models
 */
export default class ChatMeta {
    constructor({ chatId, type, movieId, createdAt, lastMessageAt, messagesCount }) {
      Object.assign(this, { chatId, type, movieId, createdAt, lastMessageAt, messagesCount });
    }
  
    static fromApi(d = {}) {
      return new ChatMeta({
        chatId: d.chatId ?? null,
        type: d.type ?? null,                       // 'global' | 'movie'
        movieId: d.movieId ?? null,                
        createdAt: d.createdAt ? new Date(d.createdAt) : null,
        lastMessageAt: d.lastMessageAt ? new Date(d.lastMessageAt) : null,
        messagesCount: d.messagesCount ?? 0,
      });
    }
  }
  
