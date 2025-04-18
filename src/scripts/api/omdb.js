export class OMDBApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    const omdURL = import.meta.env.VITE_OMDB_API_URL;
    this.baseUrl = omdURL;
  }

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

  async getMovieDetails(id) {
    const url = `${this.baseUrl}/?apikey=${this.apiKey}&i=${id}&plot=full`;
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

  async getPopularMovies(query, page = 1) {
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
}
//Export  OMDBApi class
