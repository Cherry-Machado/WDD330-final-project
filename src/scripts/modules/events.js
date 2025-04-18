export class EventsModule {
  constructor(ui) {
    this.renderEventGrid = () => {
      this.renderEventGrid;
    };
    this.setupEventListener = () => {
      this.addEventListenerById;
    };
    this.addEventListenerById = (id, callback) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('click', callback);
      } else {
        console.error(`Element with ID '${id}' not found.`);
      }
    };
    this.ui = ui; // Inyectamos el módulo de interfaz para interactuar con las vistas
    this.ui.renderEventGrid(); // Llamar a la función de renderizado de cuadrícula de eventos
    this.currentEvent = null; // Inicializar evento actual
  }

  /*  renderEventGrid() {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    const eventGrid = document.getElementById('event-grid');
    eventGrid.innerHTML = ''; // Limpiar la cuadrícula antes de renderizar

    Object.keys(events).forEach((key) => {
      const event = events[key];
      const eventCard = this.createEventCard(event);
      eventGrid.appendChild(eventCard);
    });
  } */
  setupEventListeners() {
    // Enlaces de navegación
    this.addEventListenerById('home-link', () => {
      this.ui.initNavigation('home-view');
    });

    this.addEventListenerById('create-event-link', () => {
      this.ui.initNavigation('create-event-view');
    });

    this.addEventListenerById('event-link', () => {
      this.ui.initNavigation('event-view');
    });

    this.addEventListenerById('my-events-link', () => {
      this.ui.initNavigation('my-events-view');
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
    /* const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = document.getElementById('search-input').value.trim();
      if (query) {
        this.ui.searchMovies(query);
      }
    });*/
  }

  // Función auxiliar para reducir repetición
  /*  addEventListenerById(id, callback) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', callback);
    } else {
      console.error(`Element with ID '${id}' not found.`);
    }
  } */
  /*joinEvent(eventName) {
    this.currentEvent = eventName; // Asociar usuario al evento
    alert(`You have joined the event: ${eventName}`);
  }**/
}
