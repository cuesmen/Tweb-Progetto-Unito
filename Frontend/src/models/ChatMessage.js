export default class ChatMessage {
    constructor({ id, chatId, username, text, createdAt }) {
      Object.assign(this, { id, chatId, username, text, createdAt });
    }
  
    static fromApi(d = {}) {
      return new ChatMessage({
        id: d._id ?? null,
        chatId: d.chatId ?? null,
        username: d.author?.username ?? '',
        text: d.text ?? '',
        createdAt: d.createdAt ? new Date(d.createdAt) : null,
      });
    }
  }
  