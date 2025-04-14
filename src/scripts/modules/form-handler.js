import { StorageModule } from './storage.js';
import { UIModule } from './ui.js';

const storage = new StorageModule();

const showSuccessMessage = (message) => {
  const msgContainer = document.createElement('p');
  msgContainer.textContent = message;
  msgContainer.style.color = 'green';
  msgContainer.style.fontWeight = 'bold';
  msgContainer.style.marginTop = '10px';
  document.getElementById('create-event-form').appendChild(msgContainer);

  setTimeout(() => {
    msgContainer.remove();
  }, 3000);
};

const showErrorMessage = (message) => {
  alert(message);
};

export const setupCreateEventForm = () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('event-date').setAttribute('min', today);

  const form = document.getElementById('create-event-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const eventName = document.getElementById('event-name').value.trim();
    const eventDate = document.getElementById('event-date').value;
    const eventTime = document.getElementById('event-time').value;
    const eventDescription =
      document.getElementById('event-description').value.trim() ||
      'No description provided.';
    const eventPassword = document
      .getElementById('event-password')
      .value.trim();

    // Validar que los campos obligatorios estén completos
    if (!eventName || !eventDate || !eventTime || !eventPassword) {
      showErrorMessage('All fields are required, except Description!');
      return;
    }

    // Validar que el password tenga exactamente 4 dígitos
    if (!/^\d{4}$/.test(eventPassword)) {
      showErrorMessage('The password must be exactly 4 digits.');
      return;
    }

    // Crear un nuevo evento
    const newEvent = {
      name: eventName,
      date: eventDate,
      time: eventTime,
      description: eventDescription,
      password: eventPassword,
      movies: {},
    };

    // Crear un identificador único para el evento
    const eventIdentifier = `${eventPassword}-${eventName}`;

    // Verificar si el identificador ya existe en localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events')) || {};
    if (existingEvents[eventIdentifier]) {
      alert(
        `An event with the name "${eventName}" and password "${eventPassword}" already exists!`,
      );
      return;
    }

    // Guardar el nuevo evento
    storage.saveEvent(newEvent);

    const uiModuleInstance = new UIModule();
    uiModuleInstance.renderEventGrid();

    showSuccessMessage(`Event "${eventName}" created successfully!`);
    form.reset();
  });
};
