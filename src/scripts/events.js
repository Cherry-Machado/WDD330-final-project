/**
 * Event Module - Handles all user interactions and event management
 */
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
}
