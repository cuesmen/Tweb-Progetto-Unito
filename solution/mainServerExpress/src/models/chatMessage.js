import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    chatId: { type: String, required: true, index: true },

    author: {
      username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    createdAt: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
  },
  { versionKey: false }
);

// Indexes
messageSchema.index({ chatId: 1, _id: -1 });
messageSchema.index({ chatId: 1, createdAt: -1 });

export const MessageModel =
  mongoose.models.Message || mongoose.model('Message', messageSchema);
