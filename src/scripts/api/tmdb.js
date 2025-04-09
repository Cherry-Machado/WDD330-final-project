/**
 * TMDb API Module - Handles interactions with The Movie Database API
 */
export class TMDBApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  /**
   * Search for movies
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<object>} Search results
   */
  async searchMovies(query, page = 1) {
    const url = `${this.baseUrl}/search/movie?api_key=${
      this.apiKey
    }&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get movie details
   * @param {string} movieId - TMDb movie ID
   * @returns {Promise<object>} Movie details
   */
  async getMovieDetails(movieId) {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits,videos`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get popular movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<object>} Popular movies
   */
  async getPopularMovies(page = 1) {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return response.json();
  }

  // In tmdb.js
  async getMovieDetails(movieId, retries = 3) {
    try {
      const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
      const response = await fetch(url);

      if (response.status === 429 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.getMovieDetails(movieId, retries - 1);
      }

      // ... rest of implementation
    } catch (error) {
      if (retries > 0) {
        return this.getMovieDetails(movieId, retries - 1);
      }
      throw error;
    }
  }
}
