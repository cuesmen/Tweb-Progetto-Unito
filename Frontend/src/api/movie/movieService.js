import axiosClient from "../axiosClient";
import Movie from "../../models/Movie";

export class MovieService {
  static async getMovieById(id, { signal } = {}) {
    const res = await axiosClient.get(`/movies/${id}`, { signal });

    //fake promise for loader test 
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    return res.data;
  }

  static async getRandomMovie({ signal } = {}) {
    const res = await axiosClient.get("/movies/random", { signal });
    return res.data;
  }

  static async getTopRated({ limit = 10, signal } = {}) {
    const res = await axiosClient.get("/movies/top-rated", { params: { limit }, signal });
    return res.data; 
  }
  static async getLatest({ limit = 10, signal } = {}) {
    const res = await axiosClient.get("/movies/latest", { params: { limit }, signal });
    return res.data; 
  }
}