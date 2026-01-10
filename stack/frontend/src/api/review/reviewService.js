import axiosClient from "../axiosClient";

/**
 * Service for interacting with the Review API.
 * @category API
 */
export class ReviewService {
  /**
   * Fetches all reviews by movie id.
   * @param {string|number} id
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} API response payload.
   */
  static async getReviewsByMovieId(id, { signal } = {}) {
    const res = await axiosClient.get(`/reviewmovie/${id}`, { signal });

    return res.data; 
  }
}
