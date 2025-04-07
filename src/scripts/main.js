import { ui } from "./ui.js";
import { events } from "./events.js";

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Initialize the app
function init() {
    // Set up event listeners
    events.setupEventListeners();
  
    // Load initial view
    ui.loadView(state.currentView);
  
    // Apply any saved user preferences
    if (state.userPreferences.theme === "dark") {
      document.body.classList.add("dark-theme");
    }
  }