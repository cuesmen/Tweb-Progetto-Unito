import axiosClient from "../axiosClient";

export class SearchService {
  static async search(query, { signal } = {}) {
    const res = await axiosClient.get(`/search`, {
      params: { query },
      signal,
    });

    return res.data; 
  }
}
