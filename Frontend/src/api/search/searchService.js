import axiosClient from "../axiosClient";

/**
 * Service for search across movies and actors.
 * @module api/search/searchService
 * @category API
 */
export class SearchService {
  /**
   * Performs a search across movies and actors.
   * @param {string} query
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} API response payload.
   */
  static async search(query, { signal } = {}) {
    const res = await axiosClient.get(`/search`, {
      params: { query },
      signal,
    });

    return res.data; 
  }
}
