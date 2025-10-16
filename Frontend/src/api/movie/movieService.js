import axiosClient from "../axiosClient";
import Movie from "../../models/Movie";

export class MovieService {
  static async getMovieById(id, { signal } = {}) {
    const res = await axiosClient.get(`/movies/${id}`, { signal });
    return res.data; 
  }
}
