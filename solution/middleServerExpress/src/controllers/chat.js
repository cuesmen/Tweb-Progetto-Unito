/**
 * Chat controller (business logic).
 * @module chatController
 */

import mongoose from 'mongoose';
import { connectMongoose } from '../database/database.js';
import { ChatModel } from '../models/chat.js';
import { MessageModel } from '../models/chatMessage.js';

/** Limits */
const MAX_TEXT = 2000;
const MAX_USERNAME = 50;

export function normalizeUsername(u) {
  const s = String(u ?? '').trim();
  if (!s || s.length > MAX_USERNAME) return null;
  return s;
}

export function normalizeText(t) {
  const s = String(t ?? '').trim();
  if (!s || s.length > MAX_TEXT) return null;
  return s;
}

/** Helpers */
function makeChatMeta(chatId) {
  if (chatId === 'global') {
    return { type: 'global', movieId: null };
  }
  if (chatId.startsWith('movie:')) {
    return { type: 'movie', movieId: chatId.slice(6) };
  }
  throw new Error('INVALID_CHAT_ID');
}

/**
 * Ensure chat exists and update metadata atomically.
 */
export async function upsertChat(chatId, now) {
  await connectMongoose();

  const { type, movieId } = makeChatMeta(chatId);

  const updated = await ChatModel.findOneAndUpdate(
    { chatId },
    {
      $set: { lastMessageAt: now, type, movieId },
      $inc: { messagesCount: 1 },
    },
    { new: true }
  );

  if (updated) return updated;

  return ChatModel.create({
    chatId,
    type,
    movieId,
    createdAt: now,
    lastMessageAt: now,
    messagesCount: 1,
  });
}

/**
 * Insert a message in MongoDB.
 */
export async function addMessage(chatId, username, text, now) {
  await connectMongoose();

  return MessageModel.create({
    chatId,
    author: { username },
    text,
    createdAt: now,
  });
}

/**
 * List messages with cursor-based pagination.
 */
export async function listMessages(chatId, limit = 20, cursor = null) {
  await connectMongoose();

  const filter = { chatId };

  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const lim = Math.max(1, Math.min(limit, 100));

  const docs = await MessageModel.find(filter)
    .sort({ _id: -1 })
    .limit(lim + 1)
    .lean();

  const hasMore = docs.length === lim + 1;
  const items = hasMore ? docs.slice(0, lim) : docs;
  const nextCursor = hasMore ? String(items[items.length - 1]._id) : null;

  return { items, hasMore, nextCursor };
}

/** Ensure the global chat document exists. */
async function ensureGlobalChat() {
  const now = new Date();

  await ChatModel.updateOne(
    { chatId: 'global' },
    {
      $setOnInsert: {
        chatId: 'global',
        type: 'global',
        movieId: null,
        createdAt: now,
        lastMessageAt: null,
        messagesCount: 0,
      },
    },
    { upsert: true }
  );
}