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
}
