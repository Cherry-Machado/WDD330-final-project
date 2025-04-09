/**
 * Validation helper functions
 */
export class Helpers {
  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Validate event date/time
   * @param {string} date
   * @param {string} time
   * @returns {boolean}
   */
  static validateEventDateTime(date, time) {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate > new Date();
  }

  /**
   * Format duration in minutes to hours
   * @param {number} minutes
   * @returns {string}
   */
  static formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Debounce function for API calls
   * @param {Function} func
   * @param {number} delay
   * @returns {Function}
   */
  static debounce(func, delay = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }
}
