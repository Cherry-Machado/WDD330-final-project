/**
 * Event Module - Handles all user interactions and event management
 */
export class EventModule {
  constructor() {
    this.currentEventId = null;
  }

  setupEventListeners() {
    // Interceptar clicks en los enlaces de navegación
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        this.scrollToSection(targetId);
      });
    });
  }

  // Modificar en events.js
  scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      const headerHeight = document.querySelector('.main-header').offsetHeight;
      const offset = 20; // Offset adicional
      const targetPosition = targetSection.offsetTop - headerHeight + offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }

  async showMovieDetails(movieId) {
    try {
      // Show loading state
      app.ui.loadView('movieDetails', { loading: true });

      // Fetch movie details from APIs
      const [tmdbData, omdbData] = await Promise.all([
        app.tmdbApi.getMovieDetails(movieId),
        app.omdbApi.getMovieDetails(movieId),
      ]);

      // Combine data from both APIs
      const movieData = {
        id: movieId,
        title: omdbData.Title || tmdbData.title,
        year:
          omdbData.Year ||
          (tmdbData.release_date
            ? tmdbData.release_date.substring(0, 4)
            : 'N/A'),
        rating: omdbData.imdbRating || tmdbData.vote_average,
        runtime:
          omdbData.Runtime ||
          (tmdbData.runtime ? `${tmdbData.runtime} min` : 'N/A'),
        genre:
          omdbData.Genre ||
          (tmdbData.genres
            ? tmdbData.genres.map((g) => g.name).join(', ')
            : 'N/A'),
        plot: omdbData.Plot || tmdbData.overview,
        poster:
          omdbData.Poster ||
          (tmdbData.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
            : null),
        trailer: tmdbData.videos?.results[0]?.key,
        cast: tmdbData.credits?.cast.slice(0, 5),
      };

      // Show movie details
      app.ui.loadView('movieDetails', movieData);

      // Add to recently viewed
      this.addToRecentlyViewed(movieData);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      app.ui.showNotification(
        'Failed to load movie details. Please try again.',
        'error',
      );
      app.ui.loadView('event', app.state.currentEvent);
    }
  }

  addToRecentlyViewed(movieData) {
    const { userPreferences } = app.state;
    const recent = userPreferences.recentlyViewed || [];

    // Remove if already exists
    const existingIndex = recent.findIndex((m) => m.id === movieData.id);
    if (existingIndex >= 0) {
      recent.splice(existingIndex, 1);
    }

    // Add to beginning
    recent.unshift({
      id: movieData.id,
      title: movieData.title,
      poster: movieData.poster,
      year: movieData.year,
    });

    // Keep only the last 5
    userPreferences.recentlyViewed = recent.slice(0, 5);
    app.storage.saveUserPreferences(userPreferences);
  }
}
