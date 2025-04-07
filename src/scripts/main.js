// Import modules
import { UIModule } from './ui.js';
import { EventModule } from './events.js';

// Initialize modules
const ui = new UIModule();
const events = new EventModule();
const animations = new AnimationModule();

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
