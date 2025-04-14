import { StorageModule } from './storage.js';
import { OMDBApi } from '../api/omdb.js';
// Initialize modules
const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY;

export class UIModule {
  constructor() {
    // Mapeo de vistas y sus títulos para el breadcrumb
    this.views = {
      'home-view': {
        element: document.getElementById('home-view'),
        title: 'Home',
      },
      'create-event-view': {
        element: document.getElementById('create-event-view'),
        title: 'Create Event',
      },
      'event-view': {
        element: document.getElementById('event-view'),
        title: 'Events',
      },
      'my-events-view': {
        element: document.getElementById('my-events-view'),
        title: 'My Events',
      },
    };
    // Enlaces de navegación
    this.navLinks = {
      'home-link': 'home-view',
      'create-event-link': 'create-event-view',
      'event-link': 'event-view',
      'my-events-link': 'my-events-view',
    };

    // Elementos del breadcrumb
    this.breadcrumb = document.querySelector('.breadcrumb ol');

    // Botón de menú móvil
    this.menuToggle = document.querySelector('.menu-toggle');
    this.mainMenu = document.getElementById('main-menu');

    // Inicializar
    this.initNavigation();
    this.setupEventListeners2();
    this.loadInitialView();
    this.setupMobileMenu();
    this.searchResults = document.getElementById('search-results');

    this.detailsModal = document.getElementById('details-modal'); // Modal de detalles
    this.omdbApi = new OMDBApi(omdbApiKey); // Instanciamos la API de OMDB
    this.modals = {
      search: document.getElementById('search-modal'),
      surprise: document.getElementById('surprise-modal'),
    };
    this.myEventsContainer = document.getElementById('event-grid'); // Contenedor de eventos
    this.renderEventGrid(); // Mostrar eventos guardados al iniciar
    this.movieDialog = document.getElementById('movie-dialog');
    this.poster = document.getElementById('movie-poster');
    this.title = document.getElementById('movie-title');
    this.meta = document.getElementById('movie-meta');
    this.plot = document.getElementById('movie-plot');
    this.castGrid = document.getElementById('cast-grid');
    this.trailerBtn = document.getElementById('trailer-btn');
    this.voteBtn = document.getElementById('vote-btn');
    this.currentPassword = null; // Contraseña del evento activo
    this.closeSearchModalBtn = document.getElementById('close-search-modal'); // Botón para cerrar el modal
    //is.searchModal = document.getElementById('search-modal'); // Modal para buscar películas
    this.searchForm = document.getElementById('search-form'); // Formulario de búsqueda
    this.searchInput = document.getElementById('search-input'); // Campo de entrada para la búsqueda
    this.closeSearchModalBtn = document.getElementById('close-search-modal'); // Botón para cerrar el modal
    document.querySelector('.close-btn').addEventListener('click', () => {
      this.movieDialog.close();
    });
  }

  // Configurar menú móvil
  setupMobileMenu() {
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => {
        const isExpanded =
          this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.mainMenu.classList.toggle('show');
      });
    }
  }

  // Cargar vista inicial basada en el hash de la URL
  loadInitialView() {
    const defaultView = 'home-view';
    const viewName = window.location.hash.replace('#', '') || defaultView;

    if (this.views[viewName]) {
      this.loadView2(viewName);
    } else {
      this.loadView2(defaultView);
    }
  }

  // Cargar una vista específica
  loadView2(viewName) {
    // Ocultar todas las vistas
    Object.values(this.views).forEach((view) => {
      view.element.classList.remove('active');
      view.element.setAttribute('hidden', '');
    });

    // Mostrar la vista seleccionada
    this.views[viewName].element.classList.add('active');
    this.views[viewName].element.removeAttribute('hidden');

    // Actualizar URL
    window.location.hash = viewName;

    // Actualizar enlace activo en la navegación
    this.updateActiveNavLink(viewName);

    // Actualizar breadcrumb
    this.updateBreadcrumb(viewName);

    // Cerrar menú móvil si está abierto
    if (this.mainMenu.classList.contains('show')) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.mainMenu.classList.remove('show');
    }

    // Mover foco al encabezado de la vista
    const heading = this.views[viewName].element.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }

  // Actualizar breadcrumb
  updateBreadcrumb(viewName) {
    // Limpiar breadcrumb
    this.breadcrumb.innerHTML = '<li><a href="#home-view">Home</a></li>';

    // No agregar la página actual si es la home
    if (viewName !== 'home-view') {
      const li = document.createElement('li');
      li.textContent = this.views[viewName].title;
      li.setAttribute('aria-current', 'page');
      this.breadcrumb.appendChild(li);
    }
  }

  // Actualizar el enlace de navegación activo
  updateActiveNavLink(viewName) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    // Encontrar el enlace correspondiente a la vista
    for (const [linkId, linkedView] of Object.entries(this.navLinks)) {
      if (linkedView === viewName) {
        const link = document.getElementById(linkId);
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        break;
      }
    }
  }

  // Inicializar navegación
  initNavigation() {
    // Manejar clic en enlaces de navegación
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = this.navLinks[link.id];
        this.loadView2(viewName);
      });
    });
  }

  // Configurar listeners para cambios en el hash
  setupEventListeners2() {
    window.addEventListener('hashchange', () => {
      const viewName = window.location.hash.replace('#', '');
      if (this.views[viewName]) {
        this.loadView2(viewName);
      }
    });
  }

  loadView(viewName) {
    // Ocultar todas las vistas
    Object.values(this.views).forEach((view) =>
      view.classList.remove('active'),
    );
    // Mostrar la vista seleccionada
    this.views[viewName].classList.add('active');
  }

  openModal(modalName) {
    const modal = this.modals[modalName];
    //if (modal) modal.showModal();
    if (modal) {
      this.initializeSearchModal(modal);
    }
  }
  closeModal(modalName) {
    const modal = this.modals[modalName];
    if (modal) modal.close();
  }

  renderEvents(events) {
    const eventsList = document.getElementById('events-grid');
    eventsList.innerHTML = events
      .map(
        (event) =>
          `<div>
            <strong>${event.name}</strong> - ${event.date} at ${event.time}
          </div>`,
      )
      .join('');
  }

  renderSearchResults(results) {
    const searchResults = document.getElementById('search-results');
    //<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
    searchResults.innerHTML = results
      .map(
        (movie) =>
          `<div class="movie-card">
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h4>${movie.Title}</h4>
          </div>`,
      )
      .join('');
  }

  async searchMovies(query) {
    try {
      const omdbApi = new OMDBApi('your-api-key-here'); // Instancia de OMDBApi
      const movies = await omdbApi.searchMovies(query);

      if (movies && movies.Search) {
        this.renderMovies(movies.Search); // Renderizar resultados
      } else {
        this.displayErrorMessage(
          'No movies found. Please try a different search.',
        );
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      this.displayErrorMessage('Unable to perform search. Please try again.');
    }
  }

  async loadPopularMovies() {
    try {
      const movies = await this.omdbApi.getPopularMovies(); // Recuperar películas populares
      this.renderMovies(movies.results, this.searchResults); // Renderizar en contenedor
    } catch (error) {
      console.error('Error loading popular movies:', error);
      this.displayErrorMessage('Unable to load popular movies.');
    }
  }
  // Método para renderizar películas en el contenedor
  renderMovies(movies) {
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'movie-results';
    resultsContainer.innerHTML = '';

    movies.forEach((movie) => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      movieCard.innerHTML = `
        <h4>${movie.Title}</h4>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <button class="btn vote-btn" data-movie-id="${movie.imdbID}">Vote</button>
      `;

      movieCard.querySelector('.vote-btn').addEventListener('click', (e) => {
        const movieId = e.target.getAttribute('data-movie-id');
        this.voteForMovie(movieId);
      });

      resultsContainer.appendChild(movieCard);
    });

    this.searchModal.appendChild(resultsContainer); // Mostrar resultados dentro del modal
  }

  displayErrorMessage(message) {
    this.searchResults.innerHTML = `<p style="color: red;">${message}</p>`;
  }

  async showMovieDetails(movie) {
    try {
      // Llamada a OMDb para obtener detalles completos
      const movieDetails = await this.omdbApi.getMovieDetails(movie.imdbID); // Usar imdbID para obtener detalles precisos

      // Actualizar datos del modal
      this.poster.src = movieDetails.Poster;
      this.title.innerHTML = `${movieDetails.Title} <span class="year">(${movieDetails.Year})</span>`;
      this.meta.innerHTML = `
        <span class="rating">⭐ ${movieDetails.imdbRating || 'N/A'}</span>
        <span class="duration">⏳ ${movieDetails.Runtime || 'N/A'}</span>
        <span class="genre">🎭 ${movieDetails.Genre || 'N/A'}</span>
      `;
      this.plot.innerText = movieDetails.Plot || 'No plot available.';

      // Renderizar elenco
      const cast = movieDetails.Actors?.split(', ') || [];
      this.castGrid.innerHTML = cast
        .map(
          (actor) => `
          <div class="cast-member">
            <p>${actor}</p>
          </div>
        `,
        )
        .join('');

      // Obtener votos almacenados
      const votes = this.getVotes(movieDetails.imdbID);
      this.voteBtn.innerHTML = `👍 Vote (${votes})`;
      // Renderizar el botón de votación con contador
      //document.getElementById('vote-btn').innerHTML = `👍 Vote (${votes})`;
      this.voteBtn.onclick = () => {
        this.voteForMovie(movieDetails.imdbID);
      };

      // Añadir el botón al modal dinámicamente
      const actionButtons = this.movieDialog.querySelector('.action-buttons');
      actionButtons.appendChild(this.voteBtn);

      // Configurar el botón de tráiler
      this.trailerBtn.onclick = () => {
        window.open(
          `https://www.google.com/search?q=trailer+of+${movieDetails.Title}`,
          '_blank',
        );
      };

      this.movieDialog.showModal(); // Abrir modal
    } catch (error) {
      console.error('Error fetching movie details:', error);
      this.displayErrorMessage(
        'Could not load movie details. Please try again.',
      );
    }
  }

  // Obtener votos de localStorage
  getVotes(movieId) {
    const votes = JSON.parse(localStorage.getItem('movieVotes')) || {};
    return votes[movieId] || 0;
  }

  // Registrar un voto en localStorage
  voteForMovie(movieId) {
    const events = JSON.parse(localStorage.getItem('events')) || {};

    // Buscar el evento activo usando la contraseña actual
    for (const identifier in events) {
      const event = events[identifier];
      if (event.password === this.currentPassword) {
        event.movies[movieId] = (event.movies[movieId] || 0) + 1;

        localStorage.setItem('events', JSON.stringify(events)); // Actualizar eventos en localStorage
        alert('Your vote has been recorded!');
        return;
      }
    }

    alert('An error occurred. Please try again.');
  }

  renderEventGrid() {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    this.myEventsContainer.innerHTML = '';

    Object.entries(events).forEach(([identifier, event]) => {
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';

      eventCard.innerHTML = `
          <h3>${event.name}</h3>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Description:</strong> ${event.description}</p>
          <p><strong>Password:</strong> ${event.password}</p>
          <div class="event-buttons">
            <button class="join-event-btn" data-identifier="${identifier}">Join Event</button>
            <button class="delete-event-btn" data-identifier="${identifier}">Delete Event</button>
          </div>
        `;

      eventCard
        .querySelector('.join-event-btn')
        .addEventListener('click', () => {
          this.joinEvent(identifier);
        });

      eventCard
        .querySelector('.delete-event-btn')
        .addEventListener('click', () => {
          const storage = new StorageModule();
          storage.deleteEvent(identifier);
          this.renderEventGrid();
        });

      this.myEventsContainer.appendChild(eventCard);
    });
  }

  joinEvent(identifier) {
    alert(`You joined the event with identifier "${identifier}".`);
  }

  deleteEvent(eventName) {
    const eventData = JSON.parse(localStorage.getItem('events')) || {};
    delete eventData[eventName]; // Eliminar evento del objeto
    localStorage.setItem('events', JSON.stringify(eventData));

    this.renderEventGrid(); // Actualizar la interfaz

    alert(`Event "${eventName}" deleted.`);
  }

  promptForPassword() {
    const password = prompt('Please enter your event password:');
    if (!password) {
      alert('Password is required to search movies.');
      return;
    }

    const isValid = this.validatePassword(password);
    if (isValid) {
      this.currentPassword = password; // Almacenar la contraseña validada
    }
  }

  validatePassword(password) {
    const events = JSON.parse(localStorage.getItem('events')) || {};

    // Buscar el evento con la contraseña en localStorage
    for (const identifier in events) {
      const event = events[identifier];
      if (event.password === password) {
        alert(
          `Access granted! You can search movies for the event "${event.name}".`,
        );
        return true;
      }
    }

    alert('Invalid password! Please try again.');
    return false;
  }

  initiateMovieSearch() {
    const password = this.promptForPassword();

    if (!password) {
      alert('Password is required to access movie search.');
      return;
    }

    if (this.validatePassword(password)) {
      this.enableMovieSearch();
    }
  }
  enableMovieSearch() {
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', () => {
      const query = searchBar.value.trim();

      if (!query) {
        alert('Please enter a movie title to search.');
        return;
      }

      this.searchMovies(query);
    });
  }

  initializeSearchModal() {
    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const query = this.searchInput.value.trim();
      if (!query) {
        alert('Please enter a movie title to search.');
        return;
      }

      // Validar la contraseña antes de proceder con la búsqueda
      if (!this.currentPassword) {
        this.promptForPassword();
      }

      if (this.currentPassword) {
        this.searchMovies(query); // Proceder con la búsqueda si la contraseña es válida
      }
    });

    this.closeSearchModalBtn.addEventListener('click', () => {
      this.searchModal.close();
    });
  }
}
