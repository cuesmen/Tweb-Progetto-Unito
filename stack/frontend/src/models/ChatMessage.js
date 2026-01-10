/**
 * Chat message domain model.
 * @module ChatMessage
 * @category Models
 */
export default class ChatMessage {
    constructor({ id, chatId, username, text, createdAt, senderId = null }) {
      Object.assign(this, { id, chatId, username, text, createdAt, senderId });
    }
  
    static fromApi(d = {}) {
      return new ChatMessage({
        id: d._id ?? null,
        chatId: d.chatId ?? null,
        username: d.author?.username ?? '',
        text: d.text ?? '',
        createdAt: d.createdAt ? new Date(d.createdAt) : null,
        senderId: d.senderId ?? d.sender?.id ?? null,
      });
    }
  }
  
