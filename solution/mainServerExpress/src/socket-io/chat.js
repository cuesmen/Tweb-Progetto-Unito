/**
 * Chat Socket.IO routes.
 * @module chatRoutes
 */

import {
  normalizeUsername,
  normalizeText,
  upsertChat,
  addMessage,
  listMessages,
} from '../controllers/chat.js';

/** Create the room */
function makeChatId(room) {
  if (room === 'global') return 'global';
  if (typeof room === 'string' && room.startsWith('movie:')) return room;
  return null;
}

/**
 * Socket.IO handlers factory.
 */
export function useChatSocket(io) {
  return (socket) => {

    socket.on('chat:join', (room) => {
      const chatId = makeChatId(room);
      if (!chatId) return;
      socket.join(chatId);
    });

    socket.on('chat:leave', (room) => {
      const chatId = makeChatId(room);
      if (!chatId) return;
      socket.leave(chatId);
    });

    // SEND MESSAGE
    socket.on('chat:message', async ({ room, username, text }, ack) => {
      try {
        const chatId = makeChatId(room);
        if (!chatId) return ack?.({ error: 'BAD_ROOM' });

        const u = normalizeUsername(username);
        const t = normalizeText(text);
        if (!u || !t) return ack?.({ error: 'BAD_REQUEST' });

        const now = new Date();

        await upsertChat(chatId, now);

        const saved = await addMessage(chatId, u, t, now);

        io.to(chatId).emit('chat:message', saved);
        ack?.(saved);

      } catch (err) {
        ack?.({ error: err.message || 'SEND_ERROR' });
      }
    });

    // LIST MESSAGES
    socket.on('chat:list', async ({ room, limit, cursor }, ack) => {
      try {
        const chatId = makeChatId(room);
        if (!chatId) return ack?.({ error: 'BAD_ROOM' });

        const result = await listMessages(chatId, limit, cursor);
        ack?.(result);

      } catch (err) {
        ack?.({ error: err.message || 'LIST_ERROR' });
      }
    });
  };
}
