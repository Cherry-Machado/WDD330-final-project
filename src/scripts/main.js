// Import modules
import { UIModule } from './modules/ui.js';
import { EventModule } from './modules/events.js';
import { StorageModule } from './modules/storage.js';
import { AnimationModule } from './modules/animations.js';
import { TMDBApi } from './api/tmdb.js';
import { OMDBApi } from './api/omdb.js';

// Initialize modules
const ui = new UIModule();
const events = new EventModule();
const storage = new StorageModule();
const animations = new AnimationModule();
const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY;
const tmdbApi = new TMDBApi(tmdbApiKey);
const omdbApi = new OMDBApi(omdbApiKey);

console.log(import.meta.env.VITE_TMDB_API_KEY);
console.log(import.meta.env.VITE_OMDB_API_KEY);

// App state
const state = {
  currentView: 'home',
  currentEvent: null,
  userPreferences: storage.getUserPreferences() || {
    preferredGenres: [],
    recentlyViewed: [],
  },
};

// Export modules and state for debugging
window.app = {
  ui,
  events,
  storage,
  animations,
  tmdbApi,
  omdbApi,
  state,
};

const tmdbBaseUrl = 'https://api.themoviedb.org/3';

async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${tmdbBaseUrl}/movie/${movieId}?api_key=${tmdbApiKey}&language=en-US`,
    );
    const data = await response.json();
    console.log('TMDb Movie Data:', data);
  } catch (error) {
    console.error('Error fetching TMDb movie data:', error);
  }
}

const omdbBaseUrl = 'https://www.omdbapi.com/';

async function fetchOmdbMovie(title) {
  try {
    const response = await fetch(
      `${omdbBaseUrl}?t=${encodeURIComponent(title)}&apikey=${omdbApiKey}`,
    );
    const data = await response.json();
    console.log('OMDb Movie Data:', data);
  } catch (error) {
    console.error('Error fetching OMDb movie data:', error);
  }
}

// Pruebas:
fetchMovieDetails(27205); // Reemplaza con el ID de la película (ejemplo: "Inception" - ID 27205).
fetchOmdbMovie('Inception'); // Busca por título en OMDb.

alert('Prueba de alerta'); // Prueba de alerta

// Initialize the app
function init() {
  // Set up event listeners
  events.setupEventListeners();

  // Load initial view
  ui.loadView(state.currentView);

  // Apply any saved user preferences
  if (state.userPreferences.theme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle theme toggle

// Error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  ui.showNotification(
    'An unexpected error occurred. Please try again.',
    'error',
  );
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  ui.showNotification(
    'A network error occurred. Please check your connection.',
    'error',
  );
});
