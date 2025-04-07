/**
 * UI Module - Handles all user interface rendering and updates
 */
export class UIModule {
  constructor() {
    this.views = {
      home: document.getElementById('home-view'),
      createEvent: document.getElementById('create-event-view'),
      event: document.getElementById('event-view'),
      movieDetails: document.getElementById('movie-details-view'),
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
  renderView(viewName, data) {
    switch (viewName) {
      case 'home':
        this.renderHomeView();
        break;
      case 'createEvent':
        this.renderCreateEventView();
        break;
      case 'event':
        this.renderEventView(data);
        break;
      case 'movieDetails':
        this.renderMovieDetailsView(data);
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

  renderMovieDetailsView(movieData) {
    const view = this.views.movieDetails;
    view.innerHTML = `
              <button id="back-to-event" class="btn btn-secondary">← Back to Event</button>
              
              <div class="movie-details-container">
                  <div class="movie-poster">
                      <img src="${
                        movieData.poster ||
                        'assets/images/poster-placeholder.png'
                      }" 
                           alt="${movieData.title} poster" 
                           class="fade-in">
                  </div>
                  
                  <div class="movie-info">
                      <h2>${movieData.title} <span class="release-year">(${
                        movieData.year
                      })</span></h2>
                      
                      <div class="movie-meta">
                          <span class="rating">⭐ ${
                            movieData.rating || 'N/A'
                          }</span>
                          <span class="runtime">⏱ ${
                            movieData.runtime || 'N/A'
                          } min</span>
                          <span class="genre">${movieData.genre || 'N/A'}</span>
                      </div>
                      
                      <div class="movie-plot">
                          <h3>Plot</h3>
                          <p>${movieData.plot || 'No plot available.'}</p>
                      </div>
                      
                      <div class="movie-actions">
                          <button id="vote-movie-btn" class="btn btn-primary" data-movie-id="${
                            movieData.id
                          }">
                              Vote for this Movie
                          </button>
                      </div>
                  </div>
              </div>
              
              <div class="movie-extras">
                  <div class="trailer-section">
                      <h3>Trailer</h3>
                      ${
                        movieData.trailer
                          ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${movieData.trailer}" 
                           frameborder="0" allowfullscreen></iframe>`
                          : '<p>No trailer available.</p>'
                      }
                  </div>
                  
                  <div class="cast-section">
                      <h3>Cast</h3>
                      ${
                        movieData.cast
                          ? `<ul class="cast-list">${movieData.cast
                              .slice(0, 5)
                              .map(
                                (actor) =>
                                  `<li>${actor.name} as ${
                                    actor.character || 'Unknown'
                                  }</li>`,
                              )
                              .join('')}</ul>`
                          : '<p>No cast information available.</p>'
                      }
                  </div>
              </div>
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
      // In a real app, this would fetch from your backend or local storage
      const suggestions = await this.fetchMovieSuggestions(eventId);

      if (suggestions.length === 0) {
        list.innerHTML =
          '<p class="no-suggestions">No movies suggested yet. Be the first!</p>';
        return;
      }

      list.innerHTML = suggestions
        .map(
          (movie) => `
                  <div class="movie-card" data-movie-id="${movie.id}">
                      <img src="${
                        movie.poster || 'assets/images/poster-placeholder.png'
                      }" 
                           alt="${movie.title} poster">
                      <h4>${movie.title}</h4>
                      <div class="movie-card-meta">
                          <span class="votes">${movie.votes} votes</span>
                          <span class="year">${movie.year}</span>
                      </div>
                  </div>
              `,
        )
        .join('');
    } catch (error) {
      console.error('Error loading suggestions:', error);
      list.innerHTML =
        '<p class="error">Failed to load suggestions. Please try again.</p>';
    }
  }

  async fetchMovieSuggestions(eventId) {
    // Mock data - in a real app, this would come from your data source
    return [
      {
        id: 'tt0111161',
        title: 'The Shawshank Redemption',
        year: '1994',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
        votes: 12,
      },
      {
        id: 'tt0068646',
        title: 'The Godfather',
        year: '1972',
        poster:
          'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
        votes: 8,
      },
      {
        id: 'tt0468569',
        title: 'The Dark Knight',
        year: '2008',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
        votes: 15,
      },
    ];
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
  renderMyEventsView() {
    const events = app.storage.getAllEvents();
    const container = document.querySelector('.events-grid');

    if (events.length === 0) {
      container.innerHTML = `
                  <div class="no-events">
                      <img src="assets/images/popcorn.png" alt="No events" class="empty-state">
                      <p>No events found. Start by creating a new movie night!</p>
                  </div>
              `;
      return;
    }

    container.innerHTML = events
      .map(
        (event) => `
              <article class="event-card" data-event-id="${event.id}">
                  ${this.getStatusBadge(event.date)}
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
                      <button class="btn btn-sm view-event" data-event-id="${
                        event.id
                      }">
                          View Event
                      </button>
                      <button class="btn btn-sm delete-event" data-event-id="${
                        event.id
                      }">
                          Delete
                      </button>
                  </div>
              </article>
          `,
      )
      .join('');
  }

  getStatusBadge(eventDate) {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate}T${event.time}`);
    return eventDateTime > now
      ? '<span class="status-badge">Upcoming</span>'
      : '<span class="status-badge ended">Ended</span>';
  }

  formatEventDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
}
