/**
 * Reviews controller.
 * @module reviewController
 */

import { connectMongoose } from '../database/database.js';
import { ReviewModel } from '../models/review.js';

/** Normalize and validate movie id. */
export function normalizeMovieId(id) {
  const n = Number(id);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.trunc(n);
}

/**
 * Fetch all reviews for a movie, newest first.
 * @param {number} movieId
 * @returns {Promise<Array>}
 */
export async function listReviewsByMovie(movieId) {
  const mid = normalizeMovieId(movieId);
  if (!mid) throw new Error('INVALID_MOVIE_ID');

  await connectMongoose();

  return ReviewModel.find({ movie_id: mid })
    .sort({ review_date: -1, _id: -1 })
    .lean();
}
