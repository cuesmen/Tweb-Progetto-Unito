/**
 * Mongoose connection utilities.
 * @module mongooseClient
 * @category MongoDB
 */

import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { ChatModel } from '../models/chat.js';

let connecting;

/** Connect to MongoDB via Mongoose (idempotent). */
export async function connectMongoose() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connecting) return connecting;

  const uri = ENV.MONGO_URI || 'mongodb://127.0.0.1:27017';
  const dbName = ENV.MONGO_DB || 'moviepoint';

  connecting = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    checkServerIdentity: false,
    dbName: dbName,
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

/** Close. */
export async function closeMongoose() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  connecting = null;
}
