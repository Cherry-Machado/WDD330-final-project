export class App1 {
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
}
