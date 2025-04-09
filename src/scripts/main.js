// Import modules
import { UIModule } from './ui.js';
import { EventModule } from './events.js';
import { StorageModule } from './storage.js';
import { AnimationModule } from './animations.js';
import { TMDBApi } from './api/tmdb.js';
import { OMDBApi } from './api/omdb.js';

// Initialize modules
const ui = new UIModule();
const events = new EventModule();
const storage = new StorageModule();
const animations = new AnimationModule();
const tmdbApi = new TMDBApi('8ced6a6b9346ec677b79f00b66974bec');
const omdbApi = new OMDBApi('f3512991');

// App state
const state = {
  currentView: 'home',
  currentEvent: null,
  userPreferences: storage.getUserPreferences() || {
    preferredGenres: [],
    recentlyViewed: [],
  },
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
