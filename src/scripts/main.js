import { UIModule } from './modules/ui.js';
import { EventsModule } from './modules/events.js';
import { setupCreateEventForm } from './modules/form-handler.js';
//import { App1 } from './modules/app.js';

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UIModule(); // Instancia del módulo de interfaz
  const events = new EventsModule(ui); // Instancia del módulo de eventos con ui inyectado
  events.setupEventListeners(); // Invocar su funcionalidad directamente
  ui.initTextRotation();
  ui.initParallax();
  setupCreateEventForm(); // Configurar el formulario
  ui.loadView('home-view'); // Cargar la vista inicial
});
