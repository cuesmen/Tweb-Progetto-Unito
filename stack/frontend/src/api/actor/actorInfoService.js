import axiosClient from "../axiosClient";

/**
 * Service for interacting with the ActorInfo API.
 * @category API
 */
export class ActorInfoService {
  /**
   * Fetches detailed info for an actor by id.
   * @param {string|number} id
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<any>} API response payload.
   */
  static async getActorInfoById(id, { signal } = {}) {
    const res = await axiosClient.get(`/actors/${id}/info`, { signal });
      
    //fake promise for loader test 
    //await new Promise((resolve) => setTimeout(resolve, 2000));

    return res.data; 
  }
}
