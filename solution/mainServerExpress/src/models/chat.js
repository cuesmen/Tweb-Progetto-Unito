import mongoose from 'mongoose';

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

// Indexes
chatSchema.index({ lastMessageAt: -1 });

export const ChatModel =
  mongoose.models.Chat || mongoose.model('Chat', chatSchema);
