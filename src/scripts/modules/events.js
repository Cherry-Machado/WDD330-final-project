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
  currentView: 'home-view',
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
    // Navegación entre vistas
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetView = link.getAttribute('href').substring(1); // Remove '#' from href
        ui.renderView(targetView); // Activar vista correspondiente
      });
    });

    // Botones de la Home Page
    document
      .getElementById('create-event-btn')
      .addEventListener('click', () => {
        ui.renderView('create-event-view"');
      });

    document.getElementById('join-event-btn').addEventListener('click', () => {
      ui.renderView('event-view');
    });

    document
      .getElementById('suggest-movie-btn')
      .addEventListener('click', () => {
        document.getElementById('search-modal').showModal(); // Abrir modal de búsqueda
      });

    document.querySelectorAll('.close-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.closest('dialog').close();
      });
    });

    // Manejar el evento de búsqueda de películas
    document.addEventListener('click', (event) => {
      const poster = event.target.closest('.movie-poster');
      const crearEvent = event.target.closest('#create-event-form');
      if (poster) {
        const movieCard = poster.closest('.movie-card');
        const movieId = movieCard.getAttribute('data-movie-id');
        ui.openMovieModal(movieId); // Llama al método en ui.js
      }
      if (crearEvent) {
        this.handleCreateEventForm(crearEvent);
      }
    });

    document
      .getElementById('search-modal-btn')
      .addEventListener('click', () => {
        ui.openSearchModal();
      });

    document
      .getElementById('surprise-modal-btn')
      .addEventListener('click', () => {
        ui.openSurpriseModal();
      });

    // Manejar clics en los botones "View Event" y "Delete Event"
    document.addEventListener('click', (event) => {
      const viewButton = event.target.closest('.view-event');
      const deleteButton = event.target.closest('.delete-event');

      if (viewButton) {
        const eventId = viewButton.getAttribute('data-event-id'); // Obtener el ID del evento desde el botón
        const selectedEvent = storage.getEventById(eventId); // Recuperar el evento desde el almacenamiento local

        if (!selectedEvent) {
          ui.showNotification('Event not found.', 'error'); // Notificación si el evento no existe
          return;
        }

        // Renderizar el dashboard del evento
        ui.renderEventDashboard(selectedEvent);

        // Cambiar la vista actual al dashboard
        ui.renderView('event-view');

        if (deleteButton) {
          const eventId = deleteButton.getAttribute('data-event-id');
          console.log(`Deleting event with ID: ${eventId}`);

          // Eliminar el evento del almacenamiento
          storage.deleteEventById(eventId);

          // Actualizar la vista dinámica
          const events = storage.getAllEvents(); // Recuperar eventos restantes
          ui.renderMyEvents(events);

          // Mostrar notificación de éxito
          ui.showNotification('Event deleted successfully!', 'success');
        }
      }
    });
  }

  // Modificar en events.js
  scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (!targetSection) {
      console.error(`Target section not found: ${targetId}`);
      return;
    }
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
      console.log('Movie data:', movieData);
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

    if (!movieData.id || !movieData.title || !movieData.poster) {
      console.warn('Incomplete movie data, skipping recently viewed addition.');
      return;
    }

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

  handleCreateEventForm() {
    const form = document.getElementById('create-event-form');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const eventData = {
        name: form['event-name'].value.trim(),
        date: form['event-date'].value,
        time: form['event-time'].value,
        description: form['event-description'].value.trim(),
      };

      if (!eventData.name || !eventData.date || !eventData.time) {
        ui.showNotification('Please fill in all required fields.', 'error');
        return;
      }

      storage.saveEvent(eventData); // Guardar el evento en almacenamiento local
      ui.showNotification('Event created successfully!', 'success');
      ui.renderView('my-events-view');
    });
  }

  /*
  handleCreateEventForm(form) {
    // Validate form fields
    const nameField = form.querySelector('#event-name');
    const dateField = form.querySelector('#event-date');
    const timeField = form.querySelector('#event-time');
    const descriptionField = form.querySelector('#event-description');

    if (!nameField || !dateField || !timeField || !descriptionField) {
      console.error('One or more form fields are missing in the DOM.');
      ui.showNotification(
        'Form setup is incomplete. Please check the fields.',
        'error',
      );
      return; // Stop filling the form
    }

    // Get values from the form
    const eventData = {
      id: this.generateEventId(),
      name: nameField.value.trim(),
      date: dateField.value,
      time: timeField.value,
      description: descriptionField.value.trim(),
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
    */

  handleAddCommentForm(form) {
    const textarea = form.querySelector('textarea');
    const comment = {
      id: Date.now().toString(),
      text: textarea.value,
      author: 'You', // In a real app, this would be the logged in user
      timestamp: new Date().toISOString(),
    };

    if (!textarea.value.trim()) {
      ui.showNotification('Comment cannot be empty.', 'error');
      return;
    }
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

    // Verificar si el comentario ya existe en el DOM
    const existingComment = document.querySelector(
      `[data-comment-id="${comment.id}"]`,
    );
    if (existingComment) {
      ui.showNotification('This comment already exists!', 'warning');
      //console.warn(`Duplicate comment detected: ${comment.id}`);
      return; // Salir si ya existe
    }

    // Crear y agregar el nuevo comentario
    const commentEl = document.createElement('div');
    commentEl.className = 'comment fade-in';
    commentEl.setAttribute('data-comment-id', comment.id); // Agregar un atributo único al comentario
    commentEl.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${comment.author}</span>
        <span class="comment-time">${new Date(comment.timestamp).toLocaleString()}</span>
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
