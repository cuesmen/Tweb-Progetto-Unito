import axiosClient from "../axiosClient";

/**
 * Service for interacting with the Movie API.
 * @category API
 */
export class MovieService {
  /**
   * Fetch movie details by id.
   * @param {string|number} id
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} API response payload.
   */
  static async getMovieById(id, { signal } = {}) {
    const res = await axiosClient.get(`/movies/${id}`, { signal });

    //fake promise for loader test
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    return res.data;
  }

  /**
   * Fetch a random movie suggestion.
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} API response payload.
   */
  static async getRandomMovie({ signal } = {}) {
    const res = await axiosClient.get("/movies/random", { signal });
    return res.data;
  }

  /**
   * Fetch top-rated movies.
   * @param {Object} [options]
   * @param {number} [options.limit]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} API response payload.
   */
  static async getTopRated({ limit = 10, signal } = {}) {
    const res = await axiosClient.get("/movies/top-rated", {
      params: { limit },
      signal,
    });
    return res.data;
  }
  /**
   * Fetch latest movies.
   * @param {Object} [options]
   * @param {number} [options.limit]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} API response payload.
   */
  static async getLatest({ limit = 10, signal } = {}) {
    const res = await axiosClient.get("/movies/latest", {
      params: { limit },
      signal,
    });
    return res.data;
  }
}
