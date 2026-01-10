/**
 * Chat routes backed by MongoDB.
 * @module mongo
 * @category Routes
 */

import { Router } from 'express';
import { getCollection, mongoHealth } from '../mongodb/mongo.js';
import { ObjectId, Int32 } from 'mongodb';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Chat
 *     description: Chat API (global and per-movie)
 */

/**
 * @openapi
 * /api/chat/health:
 *   get:
 *     tags: [Chat]
 *     summary: MongoDB health check and collection status
 *     responses:
 *       200:
 *         description: MongoDB state and chat/messages collections
 */
router.get('/chat/health', async (_req, res, next) => {
  try {
    const h = await mongoHealth();
    const db = await getCollection('messages').then(c => c.db);
    const cols = await db.listCollections({}, { nameOnly: true }).toArray();
    res.json({ ok: true, data: { mongo: h, collections: cols.map(c => c.name) }, error: null });
  } catch (err) {
    next(err);
  }
});

/** Common helpers */
const MAX_TEXT = 2000;
const MAX_USERNAME = 50;

function normalizeUsername(u) {
  const s = String(u ?? '').trim();
  if (!s || s.length > MAX_USERNAME) return null;
  return s;
}
function normalizeText(t) {
  const s = String(t ?? '').trim();
  if (!s || s.length > MAX_TEXT) return null;
  return s;
}
function makeMovieChatId(movieId) {
  return `movie:${String(movieId)}`;
}

function makeChatId(room) {
  if (room === 'global') return 'global';
  if (typeof room === 'string' && room.startsWith('movie:')) return room;
  return null;
}

/** Upsert chat document ensuring counters are updated without $setOnInsert/$inc collisions. */
async function upsertChat({ chatId, type, movieId = null, now }) {
  const chats = await getCollection('chats');

  // try to update if chat already exists
  const upd = await chats.updateOne(
    { chatId },
    {
      $set: { lastMessageAt: now },
      $inc: { messagesCount: new Int32(1) },
    }
  );

  if (upd.matchedCount === 1) {
    // fetch and return updated document
    return await chats.findOne({ chatId });
  }

  // if it does not exist, create with messagesCount = 1
  const doc = {
    chatId,
    type,              // 'global' | 'movie'
    movieId,           
    createdAt: now,
    lastMessageAt: now,
    messagesCount: new Int32(1),
  };

  await chats.insertOne(doc);
  return doc;
}


/** Insert a message and broadcast it on socket.io (room = chatId). */
async function insertMessageAndBroadcast({ req, chatId, username, text, now }) {
  const messages = await getCollection('messages');
  const doc = {
    chatId,
    author: { username },
    text,
    createdAt: now
  };
  const result = await messages.insertOne(doc);
  const saved = { _id: result.insertedId, ...doc };

  const io = req.app?.get?.('io') || req.io;
  if (io) io.to(chatId).emit('chat:message', saved);

  return saved;
}

/**
 * @openapi
 * /api/chat/global/messages:
 *   post:
 *     tags: [Chat]
 *     summary: Send a message to the global chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, text]
 *             properties:
 *               username: { type: string, maxLength: 50 }
 *               text: { type: string, maxLength: 2000 }
 *     responses:
 *       201:
 *         description: Message created
 */
router.post('/chat/global/messages', async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body?.username);
    const text = normalizeText(req.body?.text);
    if (!username) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`username` is required (<=50 chars)' } });
    }
    if (!text) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`text` is required (<=2000 chars)' } });
    }

    const now = new Date();
    const chatId = 'global';

    await upsertChat({ chatId, type: 'global', now });
    const saved = await insertMessageAndBroadcast({ req, chatId, username, text, now });

    res.status(201).json({ ok: true, data: { message: saved }, error: null });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/chat/movie/{movieId}/messages:
 *   post:
 *     tags: [Chat]
 *     summary: Send a message in a movie chat (creates the chat if missing)
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *         description: Movie ID (from Spring backend; treated as string)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, text]
 *             properties:
 *               username: { type: string, maxLength: 50 }
 *               text: { type: string, maxLength: 2000 }
 *     responses:
 *       201:
 *         description: Message created
 */
router.post('/chat/movie/:movieId/messages', async (req, res, next) => {
  try {
    const movieIdStr = String(req.params.movieId);
    const chatId = makeMovieChatId(movieIdStr);

    const username = normalizeUsername(req.body?.username);
    const text = normalizeText(req.body?.text);
    if (!username) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`username` is required (<=50 chars)' } });
    }
    if (!text) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`text` is required (<=2000 chars)' } });
    }

    const now = new Date();
    await upsertChat({ chatId, type: 'movie', movieId: movieIdStr, now });
    const saved = await insertMessageAndBroadcast({ req, chatId, username, text, now });

    res.status(201).json({ ok: true, data: { message: saved }, error: null });
  } catch (err) {
    next(err);
  }
});

/**
 * Socket.IO handlers factory for chat (send + list via socket).
 * Bind this in server.js: io.on('connection', useChatSocket(io))
 */
export function useChatSocket(io) {
  return (socket) => {
    socket.on('chat:message', async ({ room, username, text }, ack) => {
      try {
        const chatId = makeChatId(room);
        if (!chatId) return ack?.({ error: 'BAD_ROOM' });
        const usernameNorm = normalizeUsername(username);
        const textNorm = normalizeText(text);
        if (!usernameNorm || !textNorm) return ack?.({ error: 'BAD_REQUEST' });

        const now = new Date();
        const type = chatId === 'global' ? 'global' : 'movie';
        const movieId = chatId.startsWith('movie:') ? chatId.slice(6) : null;

        await upsertChat({ chatId, type, movieId, now });
        const saved = await insertMessageAndBroadcast({
          req: { app: { get: () => io } },
          chatId,
          username: usernameNorm,
          text: textNorm,
          now,
        });
        ack?.(saved);
      } catch (err) {
        ack?.({ error: err.message || 'SEND_ERROR' });
      }
    });

    socket.on('chat:list', async ({ room, limit = 20, cursor = null }, ack) => {
      try {
        const chatId = makeChatId(room);
        if (!chatId) return ack?.({ error: 'BAD_ROOM' });
        const lim = Math.max(1, Math.min(Number(limit) || 20, 100));
        const messages = await getCollection('messages');
        const filter = { chatId };
        if (cursor) filter._id = { $lt: new ObjectId(cursor) };
        const docs = await messages
          .find(filter)
          .sort({ _id: -1 })
          .limit(lim)
          .toArray();
        const items = docs;
        const nextCursor = docs.length === lim ? docs[docs.length - 1]._id : null;
        const hasMore = Boolean(nextCursor);
        ack?.({ items, nextCursor, hasMore });
      } catch (err) {
        ack?.({ error: err.message || 'LIST_ERROR' });
      }
    });
  };
}

/**
 * @openapi
 * /api/chat/global/messages:
 *   get:
 *     tags: [Chat]
 *     summary: Read global chat messages (cursor pagination on _id)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, minimum: 1, maximum: 100 }
  *       - in: query
  *         name: cursor
  *         schema: { type: string }
 *         description: Message _id to continue from (excludes ids >= cursor)
 *     responses:
 *       200:
 *         description: Message list (newest first)
 */
router.get('/chat/global/messages', async (req, res, next) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)));
    const cursorId = req.query.cursor;

    const messages = await getCollection('messages');
    const filter = { chatId: 'global' };
    if (cursorId && ObjectId.isValid(cursorId)) {
      filter._id = { $lt: new ObjectId(cursorId) };
    }

    const docs = await messages
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .toArray();

    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? String(items[items.length - 1]._id) : null;

    res.json({ ok: true, data: { items, nextCursor, hasMore }, error: null });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/chat/movie/{movieId}/messages:
 *   get:
 *     tags: [Chat]
 *     summary: Read movie chat messages (cursor pagination on _id)
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: cursor
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Message list (newest first)
 */
router.get('/chat/movie/:movieId/messages', async (req, res, next) => {
  try {
    const movieIdStr = String(req.params.movieId);
    const chatId = makeMovieChatId(movieIdStr);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)));
    const cursorId = req.query.cursor;

    const messages = await getCollection('messages');
    const filter = { chatId };
    if (cursorId && ObjectId.isValid(cursorId)) {
      filter._id = { $lt: new ObjectId(cursorId) };
    }

    const docs = await messages
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .toArray();

    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? String(items[items.length - 1]._id) : null;

    res.json({ ok: true, data: { items, nextCursor, hasMore }, error: null });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/chat/movie/{movieId}:
 *   get:
 *     tags: [Chat]
 *     summary: Movie chat metadata (messagesCount, lastMessageAt)
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chat metadata
 */
router.get('/chat/movie/:movieId', async (req, res, next) => {
  try {
    const movieIdStr = String(req.params.movieId);
    const chatId = makeMovieChatId(movieIdStr);
    const chats = await getCollection('chats');
    const chat = await chats.findOne({ chatId });
    res.json({ ok: true, data: chat ?? null, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
