import axiosClient from "../axiosClient";

/**
 * Service per Oscar Awards.
 */
export class OscarAwardService {
  /**
   * Fetch awards by actor id.
   * @param {string|number} id
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   */
  static async getByActorId(id, { signal } = {}) {
    const res = await axiosClient.get(`/oscaraward/actor/${id}`, { signal });
    return res.data;
  }

  /**
   * Fetch awards by movie id.
   * @param {string|number} id
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   */
  static async getByMovieId(id, { signal } = {}) {
    const res = await axiosClient.get(`/oscaraward/movie/${id}`, { signal });
    return res.data;
  }
}
