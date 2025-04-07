/**
 * UI Module - Handles all user interface rendering and updates
 */
export class UIModule {
    constructor() {
      this.views = {
        home: document.getElementById("home-view"),
        createEvent: document.getElementById("create-event-view"),
        event: document.getElementById("event-view"),
        movieDetails: document.getElementById("movie-details-view"),
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
        view.classList.remove("active");
      });
  
      // Show the requested view
      const view = this.views[viewName];
      if (view) {
        view.classList.add("active");
        this.renderView(viewName, data);
      }
    }
}  