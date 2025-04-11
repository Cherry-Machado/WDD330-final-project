/**
 * UI Module - Handles all user interface rendering and updates
 */

import { StorageModule } from './storage.js';
const storage = new StorageModule();

export class UIModule {
  constructor() {
    this.views = {
      home: document.getElementById('home-view'),
      createEvent: document.getElementById('create-event-view'),
      event: document.getElementById('event-view'),
      myeventsview: document.getElementById('my-events-view'),
    };
  }

  /**
   * Load a specific view and hide others
   * @param {string} viewName - The name of the view to load
   * @param {object} data - Optional data to pass to the view
   */
  loadView(viewName, data = {}) {
    // Hide all views
    Object.values(this.views).forEach((view) => {
      view.classList.remove('active');
    });

    // Show the requested view
    const view = this.views[viewName];
    if (view) {
      view.classList.add('active');
      this.renderView(viewName, data);
    }
  }

  /**
   * Render the content of a specific view
   * @param {string} viewName - The name of the view to render
   * @param {object} data - Data needed to render the view
   */

  renderEventCards(events) {
    const eventsGrid = document.querySelector('#my-events-view .events-grid');
    const noEventsDiv = document.querySelector('#my-events-view .no-events');

    // Limpia el contenedor de eventos
    eventsGrid.innerHTML = '';

    if (events.length === 0) {
      // Mostrar mensaje de "No events found"
      noEventsDiv.style.display = 'block';
      return;
    }

    // Ocultar el mensaje de "No events found"
    noEventsDiv.style.display = 'none';

    // Crear y agregar tarjetas de eventos
    events.forEach((event) => {
      const eventCard = this.generateEventCard(event);
      eventsGrid.appendChild(eventCard);
    });
  }

  renderView(viewName, data) {
    switch (viewName) {
      case 'home-view':
        this.renderHomeView();
        break;
      case 'create-event-view':
        this.renderCreateEventView();
        break;
      case 'event-view"':
        this.renderEventView(data);
        break;
      case 'my-events-view':
        this.renderMyEvents(data);
        break;
      default:
        console.error(`Unknown view: ${viewName}`);
    }
  }

  renderHomeView() {
    // Home view is already statically defined in HTML
  }

  renderCreateEventView() {
    const view = this.views.createEvent;
    view.innerHTML = `
            <div class="form-container fade-in">
                <h2>Create a Movie Night</h2>
                <form id="create-event-form">
                    <div class="form-group">
                        <label for="event-name">Event Name</label>
                        <input type="text" id="event-name" required placeholder="e.g., Friday Movie Night">
                    </div>
                    
                    <div class="form-group">
                        <label for="event-date">Date</label>
                        <input type="date" id="event-date" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="event-time">Time</label>
                        <input type="time" id="event-time" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="event-description">Description (Optional)</label>
                        <textarea id="event-description" placeholder="Tell your friends what to expect..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Create Event</button>
                </form>
            </div>
        `;
  }

  renderEventView(eventData) {
    const view = this.views.event;
    view.innerHTML = `
            <div class="event-header">
                <h2>${eventData.name}</h2>
                <p class="event-meta">${this.formatEventDate(
                  eventData.date,
                )} at ${eventData.time}</p>
                <p class="event-description">${
                  eventData.description || 'No description provided.'
                }</p>
            </div>
            
            <div class="event-actions">
                <button id="invite-friends-btn" class="btn btn-secondary">Invite Friends</button>
                <button id="suggest-movie-btn" class="btn btn-primary">Suggest a Movie</button>
            </div>
            
            <div class="movie-suggestions">
                <h3>Movie Suggestions</h3>
                <div id="suggestions-list" class="suggestions-grid">
                    <!-- Movie suggestions will be loaded here -->
                </div>
            </div>
            
            <div class="event-discussion">
                <h3>Discussion</h3>
                <div id="comments-section">
                    <!-- Comments will be loaded here -->
                </div>
                <form id="add-comment-form">
                    <textarea placeholder="Add your comment..."></textarea>
                    <button type="submit" class="btn btn-primary">Post Comment</button>
                </form>
            </div>
        `;

    // Load movie suggestions
    this.loadMovieSuggestions(eventData.id);
  }

  // Función modular para generar tarjetas de eventos
  generateEventCard(event) {
    // Validar datos del evento
    if (!event.date || !event.time || !event.participants) {
      console.warn(`Missing data for event: ${event.id}`);
      return; // Si faltan datos, no genera la tarjeta
    }

    const eventCard = document.createElement('article');
    eventCard.classList.add('event-card');
    eventCard.setAttribute('data-event-id', event.id);

    eventCard.innerHTML = `
      ${this.getStatusBadge(event.date, event.time)}
      <div class="event-card-header">
        <h3 class="event-title">${event.name}</h3>
        <div class="event-meta">
          <span>🗓 ${this.formatEventDate(event.date)}</span>
          <span>⏰ ${event.time}</span>
        </div>
      </div>
      <div class="event-details">
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
          </svg>
          <span>${event.participants.length} participants</span>
        </div>
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5,20V8L12,13L19,8V20H5M12,11L5,6H19L12,11Z"/>
          </svg>
          <span>${event.movies.length} suggestions</span>
        </div>
      </div>
      <div class="event-actions">
        <button class="btn btn-sm view-event" data-event-id="${event.id}">
          View Event
        </button>
        <button class="btn btn-sm delete-event" data-event-id="${event.id}">
          Delete
        </button>
      </div>
    `;
    return eventCard;
  }

  renderMovieDetailsView(movieData) {
    const movieModal = document.getElementById('movie-dialog');
    movieModal.innerHTML = `
      <div class="movie-details-container">
        <div class="movie-poster">
          <img src="${movieData.Poster}" alt="${movieData.Title} poster">
        </div>
        <div class="movie-info">
          <h2>${movieData.Title} <span class="release-year">(${movieData.Year})</span></h2>
          <div class="movie-meta">
            <span>⭐ ${movieData.imdbRating || 'N/A'}</span>
            <span>${movieData.Runtime || 'N/A'}</span>
            <span>${movieData.Genre || 'N/A'}</span>
          </div>
          <p>${movieData.Plot || 'No description available.'}</p>
        </div>
      </div>
      <button id="close-movie-dialog" class="btn btn-secondary">Close</button>
    `;
  }

  formatEventDate(dateString) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  async loadMovieSuggestions(eventId) {
    const list = document.getElementById('suggestions-list');
    list.innerHTML = '<div class="spinner"></div>';

    try {
      // Obtiene las sugerencias de películas para el evento
      const suggestions = await this.fetchMovieSuggestions(eventId);

      if (suggestions.length === 0) {
        list.innerHTML =
          '<p class="no-suggestions">No movies suggested yet. Be the first!</p>';
        return;
      }

      // Renderizar películas
      list.innerHTML = suggestions
        .map(
          (movie) => `
            <div class="movie-card" data-movie-id="${movie.id}">
              <img src="${movie.poster || 'assets/images/poster-placeholder.png'}" 
                   alt="${movie.title} poster" class="movie-poster">
              <h4>${movie.title}</h4>
              <div class="movie-card-meta">
                <span class="votes">${movie.votes} votes</span>
                <span class="year">${movie.year}</span>
              </div>
            </div>
          `,
        )
        .join('');

      // Añade eventos de clic a cada póster
      list.querySelectorAll('.movie-card .movie-poster').forEach((poster) => {
        poster.addEventListener('click', (e) => {
          const card = e.target.closest('.movie-card');
          const movieId = card.getAttribute('data-movie-id');
          this.openMovieModal(movieId); // Abrir modal con los detalles de la película
        });
      });
    } catch (error) {
      console.error('Error loading suggestions:', error);
      list.innerHTML =
        '<p class="error">Failed to load suggestions. Please try again.</p>';
    }
  }

  /**
   * Fetches movie suggestions for a specific event from local storage
   * @param {string} eventId - The ID of the event
   * @returns {Promise<Array>} Array of movie suggestions with vote counts
   */
  async fetchMovieSuggestions(eventId) {
    try {
      // Get all events from storage
      const events = JSON.parse(localStorage.getItem('movieNightEvents')) || [];

      // Find the specific event
      const event = events.find((e) => e.id === eventId);

      if (!event) {
        console.warn(`Event with ID ${eventId} not found`);
        return [];
      }

      // Return movies with vote counts
      return event.movies.map((movie) => {
        // Count votes for this movie
        const votes = event.votes
          ? event.votes.filter((v) => v.movieId === movie.id).length
          : 0;

        return {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          poster: movie.poster,
          votes: votes,
        };
      });
    } catch (error) {
      console.error('Error fetching movie suggestions:', error);
      return [];
    }
  }

  //Opens the movie modal with details
  openMovieModal(movieId) {
    const movieModal = document.getElementById('movie-dialog');
    if (!movieModal) {
      console.error('Movie dialog not found.');
      return;
    }

    // Obtener datos de la película del almacenamiento
    const events = storage.getAllEvents(); // Recuperar todos los eventos
    const allMovies = events.flatMap((event) => event.movies); // Agrupar todas las películas
    const movieData = allMovies.find((movie) => movie.id === movieId);

    if (!movieData) {
      console.error(`Movie with ID ${movieId} not found.`);
      return;
    }

    // Renderizar contenido del modal
    movieModal.innerHTML = `
      <div class="movie-details-container">
        <div class="movie-poster">
          <img src="${movieData.poster || 'assets/images/poster-placeholder.png'}" 
               alt="${movieData.title} poster">
        </div>
        <div class="movie-info">
          <h2>${movieData.title} <span class="release-year">(${movieData.year})</span></h2>
          <div class="movie-meta">
            <span class="rating">⭐ ${movieData.rating || 'N/A'}</span>
            <span class="runtime">⏱ ${movieData.runtime || 'N/A'} min</span>
            <span class="genre">${movieData.genre || 'N/A'}</span>
          </div>
          <p>${movieData.plot || 'No plot description available.'}</p>
        </div>
      </div>
      <button id="close-movie-dialog" class="btn btn-secondary">Close</button>
    `;

    // Mostrar el modal
    movieModal.showModal();

    // Configurar cierre del modal
    document
      .getElementById('close-movie-dialog')
      .addEventListener('click', () => {
        movieModal.close();
      });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} fade-in`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  showLoading(container) {
    container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
  }

  showError(message, container) {
    container.innerHTML = `
            <div class="error-state">
                <p>⚠️ ${message}</p>
                <button class="btn btn-secondary" onclick="location.reload()">Try Again</button>
            </div>
        `;
  }

  // In ui.js
  renderMyEvents(events) {
    const eventsGrid = document.querySelector('.events-grid');
    if (events.length === 0) {
      document.querySelector('.no-events').style.display = 'block';
      eventsGrid.innerHTML = '';
      return;
    }

    document.querySelector('.no-events').style.display = 'none';
    eventsGrid.innerHTML = events
      .map((event) => this.generateEventCard(event))
      .join('');
  }

  // In ui.js
  renderMyEventsView() {
    const events = storage.getAllEvents();
    const container = document.querySelector('.events-grid');
    const noEventsDiv = document.querySelector('.no-events'); // Selecciona el div existente

    // Mostrar u ocultar "no-events"
    if (events.length === 0) {
      noEventsDiv.style.display = 'block';
      container.innerHTML = ''; // Asegúrate de limpiar la vista anterior
      return;
    }

    noEventsDiv.style.display = 'none'; // Oculta el estado vacío cuando hay eventos

    container.innerHTML = events
      .map(
        (event) => `
      <article class="event-card" data-event-id="${event.id}">
        <h3 class="event-title">${event.name}</h3>
        <div class="event-actions">
          <button class="btn btn-sm view-event" data-event-id="${event.id}">
            View Event
          </button>
          <button class="btn btn-sm delete-event" data-event-id="${event.id}">
            Delete
          </button>
        </div>
      </article>
    `,
      )
      .join('');
  }

  getStatusBadge(eventDate, eventTime) {
    const now = new Date(); // Fecha y hora actual
    const eventDateTime = new Date(`${eventDate}T${eventTime}`); // Combina fecha y hora del evento

    if (isNaN(eventDateTime)) {
      return '<span class="status-badge error">Invalid date/time</span>';
    }

    if (eventDateTime > now) {
      return '<span class="status-badge">Upcoming</span>';
    }

    if (
      eventDateTime <= now &&
      eventDateTime > new Date(now.getTime() - 2 * 60 * 60 * 1000)
    ) {
      return '<span class="status-badge progress">In Progress</span>';
    }

    return '<span class="status-badge ended">Ended</span>';
  }

  renderEventDashboard(event) {
    document.querySelector('.event-title').textContent = event.name;
    document.querySelector('.event-date').textContent =
      `🗓️ ${this.formatEventDate(event.date)}`;
    document.querySelector('.event-time').textContent = `⏰ ${event.time}`;

    // Renderizar películas
    const moviesGrid = document.querySelector('.movies-grid');
    moviesGrid.innerHTML = event.movies
      .map((movie) => this.generateMovieCard(movie))
      .join('');

    // Renderizar comentarios
    const commentsList = document.querySelector('.comments-list');
    commentsList.innerHTML = event.comments
      .map((comment) => this.renderComment(comment))
      .join('');
  }

  // Generar tarjeta de película
  generateMovieCard(movie) {
    return `
      <div class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
        <h4>${movie.title}</h4>
        <div class="movie-meta">
          <span>⭐ ${movie.vote_average}</span>
          <span>${new Date(movie.release_date).getFullYear()}</span>
        </div>
      </div>
    `;
  }

  openSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (!searchModal) {
      console.error('Search modal not found.');
      return;
    }

    // Renderizar contenido dinámico si es necesario
    searchModal.innerHTML = `
      <div class="search-modal-content">
        <h2>Movie Search</h2>
        <form id="search-form">
          <input type="text" id="search-input" placeholder="Type a movie title..." />
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
        <div id="search-results" class="results-grid">
          <!-- Results will be loaded dynamically -->
        </div>
        <button id="close-search-modal" class="btn btn-secondary">Close</button>
      </div>
    `;

    searchModal.showModal();

    // Configurar cierre del modal
    document
      .getElementById('close-search-modal')
      .addEventListener('click', () => {
        searchModal.close();
      });

    // Configurar búsqueda en tiempo real
    document.getElementById('search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('search-input').value.trim();
      this.loadSearchResults(query); // Método para cargar resultados
    });
  }

  openSurpriseModal() {
    const surpriseModal = document.getElementById('surprise-modal');
    if (!surpriseModal) {
      console.error('Surprise modal not found.');
      return;
    }

    // Renderizar contenido dinámico si es necesario
    surpriseModal.innerHTML = `
      <div class="surprise-modal-content">
        <h2>Surprise Me</h2>
        <form id="surprise-form">
          <label>
            Genre:
            <input type="text" id="genre-input" placeholder="Select genre..." />
          </label>
          <label>
            Year Range:
            <input type="number" id="year-start" placeholder="Start year" />
            <input type="number" id="year-end" placeholder="End year" />
          </label>
          <button type="submit" class="btn btn-primary">Spin</button>
        </form>
        <div id="surprise-results" class="results-grid">
          <!-- Random movie will be loaded dynamically -->
        </div>
        <button id="close-surprise-modal" class="btn btn-secondary">Close</button>
      </div>
    `;

    surpriseModal.showModal();

    // Configurar cierre del modal
    document
      .getElementById('close-surprise-modal')
      .addEventListener('click', () => {
        surpriseModal.close();
      });

    // Configurar lógica sorpresa
    document.getElementById('surprise-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const genre = document.getElementById('genre-input').value.trim();
      const yearStart = document.getElementById('year-start').value;
      const yearEnd = document.getElementById('year-end').value;
      this.loadSurprisePick(genre, yearStart, yearEnd); // Método para cargar película aleatoria
    });
  }

  async loadSearchResults(query) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '<div class="spinner"></div>';

    try {
      // Simulación de búsqueda (puedes conectar con una API real)
      const results = await this.fetchMovies(query); // Método ficticio para obtener datos
      resultsContainer.innerHTML = results
        .map(
          (movie) => `
            <div class="movie-card">
              <img src="${movie.poster}" alt="${movie.title}">
              <h4>${movie.title}</h4>
            </div>
          `,
        )
        .join('');
    } catch (error) {
      console.error('Error loading search results:', error);
      resultsContainer.innerHTML = '<p>Error loading results. Try again.</p>';
    }
  }

  async loadSurprisePick(genre, yearStart, yearEnd) {
    const resultsContainer = document.getElementById('surprise-results');
    resultsContainer.innerHTML = '<div class="spinner"></div>';

    try {
      // Simulación de selección aleatoria (puedes conectar con una API real)
      const randomMovie = await this.fetchRandomMovie(
        genre,
        yearStart,
        yearEnd,
      );
      resultsContainer.innerHTML = `
        <div class="movie-card">
          <img src="${randomMovie.poster}" alt="${randomMovie.title}">
          <h4>${randomMovie.title}</h4>
        </div>
      `;
    } catch (error) {
      console.error('Error loading surprise pick:', error);
      resultsContainer.innerHTML = '<p>Error loading surprise. Try again.</p>';
    }
  }
}
