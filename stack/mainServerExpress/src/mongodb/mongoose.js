/**
 * Mongoose connection and models for chat persistence.
 * @module mongooseClient
 * @category MongoDB
 */

import mongoose from 'mongoose';
import { ENV } from '../config/env.js';

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    chatId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['global', 'movie'], required: true },
    movieId: { type: String, default: null },
    createdAt: { type: Date, default: () => new Date() },
    lastMessageAt: { type: Date, default: null },
    messagesCount: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const messageSchema = new Schema(
  {
    chatId: { type: String, required: true, index: true },
    author: {
      username: { type: String, required: true, trim: true, maxlength: 50 },
    },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: () => new Date(), index: true },
  },
  { versionKey: false }
);

chatSchema.index({ lastMessageAt: -1 });
messageSchema.index({ chatId: 1, _id: -1 });
messageSchema.index({ chatId: 1, createdAt: -1 });

export const ChatModel = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);

let connecting;

/** Connect to MongoDB via Mongoose, idempotent. */
export async function connectMongoose() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connecting) return connecting;

  const uri = ENV.MONGO_URI || 'mongodb://127.0.0.1:27017';
  const dbName = ENV.MONGO_DB || 'moviepoint';

  connecting = mongoose.connect(uri, {
    dbName,
    maxPoolSize: ENV.MONGO_MAX_POOL_SIZE ?? 20,
    minPoolSize: ENV.MONGO_MIN_POOL_SIZE ?? 0,
    serverSelectionTimeoutMS: 12_000,
    socketTimeoutMS: 45_000,
  });

  const conn = await connecting;
  await ensureGlobalChat();
  return conn;
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

/** Health status for diagnostics. */
export async function mongooseHealth() {
  await connectMongoose();
  return {
    state: mongoose.connection.readyState,
    name: mongoose.connection.name,
  };
}

/** Graceful close. */
export async function closeMongoose() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  connecting = null;
}
