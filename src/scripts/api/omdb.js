/**
 * OMDb API Module - Handles interactions with the Open Movie Database API
 */
export class OMDBApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.omdbapi.com';
  }

  /**
   * Search for movies
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<object>} Search results
   */
  async searchMovies(query, page = 1) {
    const url = `${this.baseUrl}/?apikey=${this.apiKey}&s=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error();
    }

    return data;
  }

  /**
   * Get movie details by IMDb ID
   * @param {string} imdbId - IMDb movie ID
   * @returns {Promise<object>} Movie details
   */
  async getMovieDetails(imdbId) {
    const url = `${this.baseUrl}/?apikey=${this.apiKey}&i=${imdbId}&plot=full`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error(data.Error);
    }

    return data;
  }

  /**
   * Get movie ratings by title
   * @param {string} title - Movie title
   * @param {string} year - Release year (optional)
   * @returns {Promise<object>} Movie ratings
   */
  async getMovieRatings(title, year = '') {
    const url = `${this.baseUrl}/?apikey=${this.apiKey}&t=${encodeURIComponent(title)}&y=${year}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error(data.Error);
    }

    return {
      imdbRating: data.imdbRating,
      metascore: data.Metascore,
      rottenTomatoes: this._extractRottenTomatoesScore(data.Ratings),
    };
  }

  _extractRottenTomatoesScore(ratings) {
    const rt = ratings?.find((r) => r.Source === 'Rotten Tomatoes');
    return rt ? rt.Value : 'N/A';
  }
}
