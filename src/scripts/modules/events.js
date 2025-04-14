export class EventsModule {
  constructor(ui) {
    this.ui = ui; // Inyectamos el módulo de interfaz para interactuar con las vistas
    this.setupEventListeners();
    this.ui.loadPopularMovies(); // Cargar películas populares al abrir la aplicación
    this.currentEvent = null; // Inicializar evento actual
  }

  setupEventListeners() {
    // Enlaces de navegación
    this.addEventListenerById('home-link', () => {
      this.ui.loadView('home-view');
    });

    this.addEventListenerById('create-event-link', () => {
      this.ui.loadView('create-event-view');
    });

    this.addEventListenerById('event-link', () => {
      this.ui.loadView('event-view');
    });

    this.addEventListenerById('my-events-link', () => {
      this.ui.loadView('my-events-view');
    });

    // Modales
    this.addEventListenerById('search-modal-btn', () => {
      this.ui.openModal('search');
    });

    this.addEventListenerById('close-search-modal', () => {
      this.ui.closeModal('search');
    });

    this.addEventListenerById('surprise-modal-btn', () => {
      this.ui.openModal('surprise');
    });

    this.addEventListenerById('close-surprise-modal', () => {
      this.ui.closeModal('surprise');
    });

    // Búsqueda de películas
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = document.getElementById('search-input').value.trim();
      if (query) {
        this.ui.searchMovies(query);
      }
    });
  }

  // Función auxiliar para reducir repetición
  addEventListenerById(id, callback) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', callback);
    } else {
      console.error(`Element with ID '${id}' not found.`);
    }
  }
  joinEvent(eventName) {
    this.currentEvent = eventName; // Asociar usuario al evento
    alert(`You have joined the event: ${eventName}`);
  }
}
