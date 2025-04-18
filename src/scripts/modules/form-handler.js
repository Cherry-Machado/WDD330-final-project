//import { StorageModule } from './storage.js';
import { UIModule } from './ui.js';

//const storage = new StorageModule();

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
  const msgContainer = document.createElement('p');
  msgContainer.textContent = message;
  msgContainer.style.color = 'red';
  msgContainer.style.fontWeight = 'bold';
  msgContainer.style.marginTop = '10px';
  document.getElementById('create-event-form').appendChild(msgContainer);

  setTimeout(() => {
    msgContainer.remove();
  }, 3000);
};

export const setupCreateEventForm = () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('event-date').setAttribute('min', today);

  const form = document
    .getElementById('create-event-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();

      const eventName = document.getElementById('event-name').value.trim();
      const eventDate = document.getElementById('event-date').value;
      const eventTime = document.getElementById('event-time').value;
      const eventDescription =
        document.getElementById('event-description').value.trim() ||
        'No description provided.';
      const eventPassword = document.getElementById('event-password').value;

      // Validar que todos los campos necesarios estén completos
      if (!eventName || !eventDate || !eventTime || !eventPassword) {
        alert('All fields are required!');
        return;
      }

      // Validar que el password tenga exactamente 4 dígitos numéricos
      if (!/^\d{4}$/.test(eventPassword)) {
        alert('Password must be exactly 4 digits.');
        return;
      }

      // Obtener los eventos almacenados previamente en localStorage
      const existingEvents = JSON.parse(localStorage.getItem('events')) || {};

      // Verificar si ya existe un evento con la misma contraseña
      if (existingEvents[eventPassword]) {
        showErrorMessage(
          'An event with this password already exists. Input a different password.',
        );

        return;
      }

      // Crear un nuevo evento
      const newEvent = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        password: eventPassword,
        movies: {}, // Espacio reservado para películas sugeridas
      };

      // Guardar el nuevo evento y verificar si fue exitoso
      /*const storage = new StorageModule();
      const saveResult = storage.saveEvent(newEvent);*/
      existingEvents[eventPassword] = newEvent;
      const saveResult = localStorage.setItem(
        'events',
        JSON.stringify(existingEvents),
      );

      if (saveResult) {
        const uiModuleInstance = new UIModule();
        uiModuleInstance.renderEventGrid();
        showSuccessMessage(`Event "${eventName}" created successfully!`);
        form.reset();
      } else {
        showErrorMessage('Failed to save event. Please try again.');
      }
    });
};
/*
export const setupCreateEventForm = () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('event-date').setAttribute('min', today);

  const form = document.getElementById('create-event-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventTime = document.getElementById('event-time').value;
    const eventDescription =
      document.getElementById('event-description').value ||
      'No description provided.';
    const eventPassword = document.getElementById('event-password').value;

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
    const userIdentifier = `${eventPassword}`;

    // Verificar si el identificador ya existe en localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events')) || {};
    if (existingEvents[userIdentifier]) {
      alert('An User with the name password already exists!');
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
*/
