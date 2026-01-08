/**
   * @typedef {Object} ReviewApi
   * @property {number} id
   * @property {number} movieId
   * @property {string} critic_name
   * @property {boolean} top_critic
   * @property {string} publisher_name
   * @property {string} review_type
   * @property {string} review_score
   * @property {string} review_date  // ISO date (yyyy-MM-dd)
   * @property {string} review_content
   */

export default class Review {
    /**
     * @param {ReviewApi} args
     */
    constructor({
      id,
      movieId,
      critic_name = "",
      top_critic = false,
      publisher_name = "",
      review_type = "",
      review_score = "",
      review_date = "",
      review_content = "",
    }) {
      this.id = id;
      this.movieId = movieId;
      this.critic_name = critic_name;
      this.top_critic = top_critic;
      this.publisher_name = publisher_name;
      this.review_type = review_type;
      this.review_score = review_score;
      this.review_date = review_date;
      this.review_content = review_content;

      Object.freeze(this);
    }

    get dateIso() {
      return this.review_date || "";
    }

    toJSON() {
      return {
        id: this.id,
        movieId: this.movieId,
        critic_name: this.critic_name,
        top_critic: this.top_critic,
        publisher_name: this.publisher_name,
        review_type: this.review_type,
        review_score: this.review_score,
        review_date: this.review_date,
        review_content: this.review_content,
      };
    }

    /**
     * @param {any} data
     * @returns {Review}
     */
    static fromApi(data) {
      if (!data || typeof data !== "object") {
        throw new Error("Review.fromApi: payload invalido");
      }

      return new Review({
        id: data.id,
        movieId: data.movieId,
        critic_name: data.critic_name,
        top_critic: data.top_critic,
        publisher_name: data.publisher_name,
        review_type: data.review_type,
        review_score: data.review_score,
        review_date: data.review_date,
        review_content: data.review_content,
      });
    }

    /**
     * @param {any[]} arr
     * @returns {Review[]}
     */
    static listFromApi(arr) {
      if (!Array.isArray(arr)) return [];
      return arr.map(Review.fromApi);
    }
  }
