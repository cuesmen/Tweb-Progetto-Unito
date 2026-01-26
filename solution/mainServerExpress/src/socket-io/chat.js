/**
 * Chat Socket.IO routes (gateway -> middle).
 * The gateway only validates rooms and forwards events to the middle server,
 * which is the component that writes/reads from MongoDB.
 * @module chatRoutes
 */

import { io as createMiddleClient } from 'socket.io-client';
import { ENV } from '../config/env.js';

/** Create the room */
function makeChatId(room) {
  if (room === 'global') return 'global';
  if (typeof room === 'string' && room.startsWith('movie:')) return room;
  return null;
}

// Persistent upstream connection to the middle layer
const middleSocket = createMiddleClient(ENV.MIDDLE_SOCKET_URL, {
  transports: ['websocket'],
});

middleSocket.on('connect', () => {
  console.log('[chat] Connected to middle Socket.IO');
});

middleSocket.on('connect_error', (err) => {
  console.error('[chat] Middle socket connection error:', err.message);
});

/**
 * Socket.IO handlers factory.
 */
export function useChatSocket(io) {
  // Relay messages pushed by the middle server (in case other producers write there)
  middleSocket.on('chat:message', (msg) => {
    if (!msg?.chatId) return;
    io.to(msg.chatId).emit('chat:message', msg);
  });

  return (socket) => {

    socket.on('chat:join', (room) => {
      const chatId = makeChatId(room);
      if (!chatId) return;
      socket.join(chatId);
      if (middleSocket.connected) {
        middleSocket.emit('chat:join', chatId);
      }
    });

    socket.on('chat:leave', (room) => {
      const chatId = makeChatId(room);
      if (!chatId) return;
      socket.leave(chatId);
      if (middleSocket.connected) {
        middleSocket.emit('chat:leave', chatId);
      }
    });

    // SEND MESSAGE (forward to middle)
    socket.on('chat:message', ({ room, username, text }, ack) => {
      const chatId = makeChatId(room);
      if (!chatId) return ack?.({ error: 'BAD_ROOM' });

      if (!middleSocket.connected) {
        return ack?.({ error: 'MIDDLE_UNAVAILABLE' });
      }

      middleSocket.emit('chat:message', { room: chatId, username, text }, (res) => {
        ack?.(res);
      });
    });

    // LIST MESSAGES (forward to middle)
    socket.on('chat:list', ({ room, limit, cursor }, ack) => {
      const chatId = makeChatId(room);
      if (!chatId) return ack?.({ error: 'BAD_ROOM' });

      if (!middleSocket.connected) {
        return ack?.({ error: 'MIDDLE_UNAVAILABLE' });
      }

      middleSocket.emit('chat:list', { room: chatId, limit, cursor }, (res) => {
        ack?.(res);
      });
    });
  };
}
