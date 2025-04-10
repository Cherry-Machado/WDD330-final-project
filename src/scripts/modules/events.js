/**
 * Event Module - Handles all user interactions and event management
 */

import { UIModule } from './ui.js';
import { StorageModule } from './storage.js';
import { TMDBApi } from '../api/tmdb.js';
import { OMDBApi } from '../api/omdb.js';

// Initialize modules
const ui = new UIModule();
const storage = new StorageModule();
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
      ui.loadView('movieDetails', { loading: true });

      // Fetch movie details from APIs
      const [tmdbData, omdbData] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        omdbApi.getMovieDetails(movieId),
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
      ui.loadView('movieDetails', movieData);

      // Add to recently viewed
      this.addToRecentlyViewed(movieData);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      ui.showNotification(
        'Failed to load movie details. Please try again.',
        'error',
      );
      ui.loadView('event', state.currentEvent);
    }
  }

  addToRecentlyViewed(movieData) {
    const { userPreferences } = state;
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
    storage.saveUserPreferences(userPreferences);
  }

  handleCreateEventForm(form) {
    const eventData = {
      id: this.generateEventId(),
      name: form.querySelector('#event-name').value,
      date: form.querySelector('#event-date').value,
      time: form.querySelector('#event-time').value,
      description: form.querySelector('#event-description').value,
      movies: [],
      participants: [],
      comments: [],
    };

    // Save the event
    storage.saveEvent(eventData);

    // Update app state
    state.currentEvent = eventData;
    state.currentView = 'event';

    // Show the event view
    ui.loadView('event', eventData);

    // Show success message
    ui.showNotification('Event created successfully!', 'success');
  }

  handleAddCommentForm(form) {
    const textarea = form.querySelector('textarea');
    const comment = {
      id: Date.now().toString(),
      text: textarea.value,
      author: 'You', // In a real app, this would be the logged in user
      timestamp: new Date().toISOString(),
    };

    // Add to current event
    if (state.currentEvent) {
      state.currentEvent.comments.push(comment);
      storage.saveEvent(state.currentEvent);

      // Update UI
      this.renderComment(comment);

      // Clear form
      textarea.value = '';

      // Show success
      ui.showNotification('Comment added!', 'success');
    }
  }

  renderComment(comment) {
    const commentsSection = document.getElementById('comments-section');
    if (!commentsSection) return;

    const commentEl = document.createElement('div');
    commentEl.className = 'comment fade-in';
    commentEl.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-time">${new Date(
                  comment.timestamp,
                ).toLocaleString()}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        `;

    commentsSection.appendChild(commentEl);
  }

  generateEventId() {
    return 'event-' + Math.random().toString(36).substr(2, 9);
  }

  showJoinEventModal() {
    // In a real app, this would show a modal to enter an event ID
    ui.showNotification('Feature coming soon!', 'info');
  }
}
