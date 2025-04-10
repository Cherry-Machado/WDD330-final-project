export class TMDBApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  async searchMovies(query, page = 1) {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return response.json();
  }

  async getPopularMovies(page = 1) {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return response.json();
  }

  async getMovieDetails(movieId, retries = 3) {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    const response = await fetch(url);
    if (response.status === 429 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.getMovieDetails(movieId, retries - 1);
    }
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return response.json();
  }
}
//(ratings) {

/*class TMDBApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  async searchMovies(query, page = 1) {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`TMDb API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async getPopularMovies(page = 1) {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`TMDb API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId, retries = 3) {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (response.status === 429 && retries > 0) {
        console.warn('Rate limit reached. Retrying...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.getMovieDetails(movieId, retries - 1);
      }
      if (!response.ok) throw new Error(`TMDb API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      if (retries > 0) return this.getMovieDetails(movieId, retries - 1);
      throw error;
    }
  }
}
export default TMDBApi;
//*/
