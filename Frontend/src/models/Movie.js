/**
 * @typedef {{ id:number, link:string }} Poster
 * @typedef {{ id:number, theme:string }} Theme
 * @typedef {{ id:number, actorId:number, actorName:string, role:string }} CastItem
 * @typedef {{ personId:number, personName:string, roleId:number, roleName:string }} CrewItem
 * @typedef {{ id:number, country:{ id:number, country:string }, releaseDate:string, releaseType:string, rating: (string|null) }} Release
 * @typedef {{ id:number, genre:string }} GenreItem
 * @typedef {{ id:number, name:string }} StudioItem
 * @typedef {{ id:number, country:string }} CountryItem
 * @typedef {{ id:number, language:string }} LanguageItem
 *
 * @typedef {Object} MovieApi
 * @property {number} id
 * @property {string} name
 * @property {number} date
 * @property {string} tagline
 * @property {string} description
 * @property {number} minute
 * @property {number} rating
 * @property {Poster} poster
 * @property {Theme[]} themes
 * @property {CastItem[]} cast
 * @property {CrewItem[]} crew
 * @property {Release[]} releases
 * @property {GenreItem[]} genres
 * @property {StudioItem[]} studios
 * @property {CountryItem[]} countries
 * @property {LanguageItem[]} languages
 */

export default class Movie {
    /**
     * @param {Object} args
     * @param {number} args.id
     * @param {string} args.name
     * @param {number} args.date
     * @param {string} [args.tagline]
     * @param {string} [args.description]
     * @param {number} [args.minute]
     * @param {number} [args.rating]
     * @param {Poster} [args.poster]
     * @param {Theme[]} [args.themes]
     * @param {CastItem[]} [args.cast]
     * @param {CrewItem[]} [args.crew]
     * @param {Release[]} [args.releases]
     * @param {GenreItem[]} [args.genres]
     * @param {StudioItem[]} [args.studios]
     * @param {CountryItem[]} [args.countries]
     * @param {LanguageItem[]} [args.languages]
     */
    constructor({
      id,
      name,
      date,
      tagline = "",
      description = "",
      minute = 0,
      rating = 0,
      poster = null,
      themes = [],
      cast = [],
      crew = [],
      releases = [],
      genres = [],
      studios = [],
      countries = [],
      languages = [],
    }) {
      this.id = id;
      this.name = name;
      this.date = date; 
      this.tagline = tagline;
      this.description = description;
      this.minute = minute; 
      this.rating = rating;
      this.poster = poster;
      this.themes = themes;
      this.cast = cast;
      this.crew = crew;
      this.releases = releases;
      this.genres = genres;
      this.studios = studios;
      this.countries = countries;
      this.languages = languages;
  
      Object.freeze(this.themes);
      Object.freeze(this.cast);
      Object.freeze(this.crew);
      Object.freeze(this.releases);
      Object.freeze(this.genres);
      Object.freeze(this.studios);
      Object.freeze(this.countries);
      Object.freeze(this.languages);
      if (this.poster && typeof this.poster === "object") Object.freeze(this.poster);
      Object.freeze(this);
    }
  
  
    get shortTitle() {
      return `${this.name}${this.date ? ` (${this.date})` : ""}`;
    }
  
    get runtimeHhMm() {
      return Movie.#formatMinutes(this.minute);
    }
  
    get posterUrl() {
      return this.poster?.link ?? "";
    }
  
    get genreNames() {
      return this.genres.map(g => g.genre);
    }
  
    topCast(n = 5) {
      return this.cast.slice(0, n);
    }
  
    hasGenre(name) {
      if (!name) return false;
      const q = String(name).toLowerCase();
      return this.genres.some(g => g.genre.toLowerCase() === q);
    }
  
    getReleaseForCountry(countryName) {
      if (!countryName) return null;
      const q = countryName.toLowerCase();
      return this.releases.find(r => r.country?.country?.toLowerCase() === q) || null;
    }
  
    get primaryReleaseDate() {
      if (!this.releases.length) return null;
      const theatrical = this.releases
        .filter(r => r.releaseType?.toLowerCase() === "theatrical")
        .sort((a, b) => Movie.#cmpDateAsc(a.releaseDate, b.releaseDate));
      if (theatrical.length) return theatrical[0].releaseDate;
  
      const all = [...this.releases].sort((a, b) => Movie.#cmpDateAsc(a.releaseDate, b.releaseDate));
      return all[0].releaseDate ?? null;
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        date: this.date,
        tagline: this.tagline,
        description: this.description,
        minute: this.minute,
        rating: this.rating,
        poster: this.poster,
        themes: [...this.themes],
        cast: [...this.cast],
        crew: [...this.crew],
        releases: [...this.releases],
        genres: [...this.genres],
        studios: [...this.studios],
        countries: [...this.countries],
        languages: [...this.languages],
      };
    }
  
    static fromApi(data) {
      if (!data || typeof data !== "object") {
        throw new Error("Movie.fromApi: payload invalido");
      }
  
      return new Movie({
        id: data.id,
        name: data.name,
        date: data.date,
        tagline: data.tagline,
        description: data.description,
        minute: data.minute,
        rating: data.rating,
        poster: data.poster ?? null,
        themes: Array.isArray(data.themes) ? data.themes : [],
        cast: Array.isArray(data.cast) ? data.cast : [],
        crew: Array.isArray(data.crew) ? data.crew : [],
        releases: Array.isArray(data.releases) ? data.releases : [],
        genres: Array.isArray(data.genres) ? data.genres : [],
        studios: Array.isArray(data.studios) ? data.studios : [],
        countries: Array.isArray(data.countries) ? data.countries : [],
        languages: Array.isArray(data.languages) ? data.languages : [],
      });
    }
  
    static listFromApi(arr) {
      if (!Array.isArray(arr)) return [];
      return arr.map(Movie.fromApi);
    }
    
    static #formatMinutes(m) {
      if (!m || m <= 0) return "—";
      const h = Math.floor(m / 60);
      const min = m % 60;
      return `${h}h ${min}m`;
      }
  
    static #cmpDateAsc(a, b) {
      const da = a ? Date.parse(a) : Number.POSITIVE_INFINITY;
      const db = b ? Date.parse(b) : Number.POSITIVE_INFINITY;
      return da - db;
    }
  }
  