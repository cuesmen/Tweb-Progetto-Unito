import { Router } from 'express';
import { getCollection, mongoHealth } from '../mongodb/mongo.js';
import { ObjectId, Int32 } from 'mongodb';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Chat
 *     description: API di chat (globale e per film)
 */

/**
 * @openapi
 * /api/chat/health:
 *   get:
 *     tags: [Chat]
 *     summary: Health check di MongoDB e stato collezioni
 *     responses:
 *       200:
 *         description: Stato di MongoDB e collezioni chat/messages
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

/** Helpers comuni */
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

/** Upsert chat (senza collisioni $setOnInsert/$inc) */
async function upsertChat({ chatId, type, movieId = null, now }) {
  const chats = await getCollection('chats');

  // prova ad aggiornare se la chat esiste già
  const upd = await chats.updateOne(
    { chatId },
    {
      $set: { lastMessageAt: now },
      $inc: { messagesCount: new Int32(1) },
    }
  );

  if (upd.matchedCount === 1) {
    // recupera e ritorna il documento aggiornato
    return await chats.findOne({ chatId });
  }

  // se non esiste, creala con messagesCount = 1
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


/** Inserisce messaggio e broadcast su socket.io (room = chatId) */
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

  const io = req.app.get('io');
  if (io) io.to(chatId).emit('chat:message', saved);

  return saved;
}

/**
 * @openapi
 * /api/chat/global/messages:
 *   post:
 *     tags: [Chat]
 *     summary: Invia un messaggio nella chat globale
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
 *         description: Messaggio creato
 */
router.post('/chat/global/messages', async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body?.username);
    const text = normalizeText(req.body?.text);
    if (!username) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`username` è obbligatorio (<=50)' } });
    }
    if (!text) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`text` è obbligatorio (<=2000)' } });
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
 *     summary: Invia un messaggio nella chat del film (crea la chat se non esiste)
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *         description: ID del film (arriva dal backend Spring; trattato come stringa)
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
 *         description: Messaggio creato
 */
router.post('/chat/movie/:movieId/messages', async (req, res, next) => {
  try {
    const movieIdStr = String(req.params.movieId);
    const chatId = makeMovieChatId(movieIdStr);

    const username = normalizeUsername(req.body?.username);
    const text = normalizeText(req.body?.text);
    if (!username) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`username` è obbligatorio (<=50)' } });
    }
    if (!text) {
      return res.status(400).json({ ok: false, data: null, error: { code: 'BAD_REQUEST', message: '`text` è obbligatorio (<=2000)' } });
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
 * @openapi
 * /api/chat/global/messages:
 *   get:
 *     tags: [Chat]
 *     summary: Legge messaggi della chat globale (paginazione con cursor su _id)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: cursor
 *         schema: { type: string }
 *         description: _id del messaggio da cui continuare (esclude gli id >= cursor)
 *     responses:
 *       200:
 *         description: Lista messaggi (più recenti per primi)
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
 *     summary: Legge messaggi della chat di un film (paginazione con cursor su _id)
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
 *         description: Lista messaggi (più recenti per primi)
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
 *     summary: Metadati della chat del film (messagesCount, lastMessageAt)
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Metadati chat
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
