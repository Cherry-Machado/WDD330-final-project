// Import modules
import { UIModule } from './modules/ui.js';
import { EventModule } from './modules/events.js';
import { StorageModule } from './modules/storage.js';
import { AnimationModule } from './modules/animations.js';
import { TMDBApi } from './api/tmdb.js';
import { OMDBApi } from './api/omdb.js';

console.log(import.meta.env.VITE_TMDB_API_KEY);

// Initialize modules
const ui = new UIModule();
const events = new EventModule();
const storage = new StorageModule();
const animations = new AnimationModule();
const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY;
const tmdbApi = new TMDBApi(tmdbApiKey);
const omdbApi = new OMDBApi(omdbApiKey);

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
