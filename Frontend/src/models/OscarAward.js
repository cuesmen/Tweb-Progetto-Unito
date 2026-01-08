/**
 * Oscar award domain model.
 * @module OscarAward
 * @category Models
 */
/**
 * @typedef {Object} OscarAwardApi
 * @property {number} id
 * @property {string} yearFilm
 * @property {string} yearCeremony
 * @property {string} category
 * @property {string} name
 * @property {string} film
 * @property {boolean} winner
 * @property {number|null} actorId
 * @property {number|null} movieId
 */

/** @private */
export default class OscarAward {
  /**
   * @param {OscarAwardApi} args
   */
  constructor({
    id,
    yearFilm = "",
    yearCeremony = "",
    category = "",
    name = "",
    film = "",
    winner = false,
    actorId = null,
    movieId = null,
  }) {
    this.id = id;
    this.yearFilm = yearFilm;
    this.yearCeremony = yearCeremony;
    this.category = category;
    this.name = name;
    this.film = film;
    this.winner = Boolean(winner);
    this.actorId = actorId;
    this.movieId = movieId;
    Object.freeze(this);
  }

  /**
   * @param {any} data
   * @returns {OscarAward}
   */
  static fromApi(data) {
    if (!data || typeof data !== "object") {
      throw new Error("OscarAward.fromApi: payload invalido");
    }
    return new OscarAward({
      id: data.id,
      yearFilm: data.yearFilm,
      yearCeremony: data.yearCeremony,
      category: data.category,
      name: data.name,
      film: data.film,
      winner: data.winner,
      actorId: data.actorId ?? null,
      movieId: data.movieId ?? null,
    });
  }

  /**
   * @param {any[]} arr
   * @returns {OscarAward[]}
   */
  static listFromApi(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(OscarAward.fromApi);
  }
}
