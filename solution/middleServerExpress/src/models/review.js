import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    movie_id: {
      type: Number,
      required: true,
      index: true,
    },

    critic_name: {
      type: String,
      default: null,
    },

    top_critic: {
      type: Boolean,
      default: false,
      index: true,
    },

    publisher_name: {
      type: String,
      default: null,
    },

    review_type: {
      type: String,
      enum: ['Fresh', 'Rotten'],
      required: true,
      index: true,
    },

    review_score: {
      type: String,  
      default: null,
    },

    review_date: {
      type: Date,
      index: true,
    },

    review_content: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

reviewSchema.index({ movie_id: 1, review_date: -1 });
reviewSchema.index({ movie_id: 1, review_type: 1 });
reviewSchema.index({ movie_id: 1, top_critic: 1 });

export const ReviewModel =
  mongoose.models.Review || mongoose.model('Review', reviewSchema);
