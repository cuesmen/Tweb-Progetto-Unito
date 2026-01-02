import axiosClient from "../axiosClient";

export class ActorInfoService {
  static async getActorInfoById(id, { signal } = {}) {
    const res = await axiosClient.get(`/actors/${id}/info`, { signal });
      
    //fake promise for loader test 
    //await new Promise((resolve) => setTimeout(resolve, 2000));

    return res.data; 
  }
}
