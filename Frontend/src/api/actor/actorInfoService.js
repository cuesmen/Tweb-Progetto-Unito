import axiosClient from "../axiosClient";

export class ActorInfoService {
  static async getActorInfoById(id, { signal } = {}) {
    const res = await axiosClient.get(`/actors/${id}/info`, { signal });
    return res.data; 
  }
}
