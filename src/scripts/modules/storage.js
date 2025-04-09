/**
 * Storage Module - Handles data persistence using localStorage
 */

export class StorageModule {
  constructor() {
    this.eventsKey = 'movieNightEvents';
    this.userPrefsKey = 'movieNightUserPrefs';
  }

  /**
   * Save an event to localStorage
   * @param {object} eventData - The event data to save
   */
  saveEvent(eventData) {
    let events = this.getAllEvents();

    // Check if event already exists
    const existingIndex = events.findIndex((e) => e.id === eventData.id);
    if (existingIndex >= 0) {
      events[existingIndex] = eventData;
    } else {
      events.push(eventData);
    }

    localStorage.setItem(this.eventsKey, JSON.stringify(events));
  }

  /**
   * Get all saved events
   * @returns {array} Array of event objects
   */
  getAllEvents() {
    const eventsJson = localStorage.getItem(this.eventsKey);
    return eventsJson ? JSON.parse(eventsJson) : [];
  }

  /**
   * Get a specific event by ID
   * @param {string} eventId - The ID of the event to retrieve
   * @returns {object|null} The event data or null if not found
   */
  getEvent(eventId) {
    const events = this.getAllEvents();
    return events.find((e) => e.id === eventId) || null;
  }

  /**
   * Delete an event
   * @param {string} eventId - The ID of the event to delete
   */
  deleteEvent(eventId) {
    let events = this.getAllEvents();
    events = events.filter((e) => e.id !== eventId);
    localStorage.setItem(this.eventsKey, JSON.stringify(events));
  }

  /**
   * Save user preferences
   * @param {object} prefs - User preferences object
   */
  saveUserPreferences(prefs) {
    localStorage.setItem(this.userPrefsKey, JSON.stringify(prefs));
  }

  /**
   * Get user preferences
   * @returns {object} User preferences object
   */
  getUserPreferences() {
    const prefsJson = localStorage.getItem(this.userPrefsKey);
    return prefsJson ? JSON.parse(prefsJson) : null;
  }

  /**
   * Clear all application data
   */
  clearAllData() {
    localStorage.removeItem(this.eventsKey);
    localStorage.removeItem(this.userPrefsKey);
  }

  /**
   * Save user's vote for a movie in an event
   * @param {string} eventId
   * @param {string} movieId
   * @param {string} userId
   */
  saveVote(eventId, movieId, userId) {
    const events = this.getAllEvents();
    const event = events.find((e) => e.id === eventId);

    if (event) {
      // Remove existing vote
      event.votes = event.votes.filter((v) => v.userId !== userId);
      // Add new vote
      event.votes.push({ movieId, userId, timestamp: Date.now() });
      localStorage.setItem(this.eventsKey, JSON.stringify(events));
    }
  }

  /**
   * Add movie suggestion to an event
   * @param {string} eventId
   * @param {object} movieData
   */
  addMovieSuggestion(eventId, movieData) {
    const events = this.getAllEvents();
    const event = events.find((e) => e.id === eventId);

    if (event) {
      event.movies.push({
        ...movieData,
        id: `movie-${Date.now()}`,
        votes: 0,
        comments: [],
      });
      localStorage.setItem(this.eventsKey, JSON.stringify(events));
    }
  }

  /**
   * Get all votes for an event
   * @param {string} eventId
   * @returns {array} Array of votes
   */
  getEventVotes(eventId) {
    const event = this.getEvent(eventId);
    return event?.votes || [];
  }
}
