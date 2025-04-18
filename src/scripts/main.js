import { UIModule } from './modules/ui.js';
import { EventsModule } from './modules/events.js';
//import { App1 } from './modules/app.js';

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UIModule(); // Instancia del módulo de interfaz
  const events = new EventsModule(ui); // Instancia del módulo de eventos con ui inyectado
  events.renderEventGrid(); // Configurar el formulario
  ui.initNavigation(); // Cargar la vista inicial
  ui.initTextRotation();
  ui.initParallax();
  events.setupEventListeners(); // Invocar su funcionalidad directamente
});
