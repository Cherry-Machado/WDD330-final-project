export class StorageModule {
  constructor(storageKey = 'events') {
    // Verificar que localStorage esté disponible
    if (!this.isLocalStorageAvailable()) {
      throw new Error('LocalStorage is not available');
    }
    this.storageKey = storageKey;
  }

  getEvents() {
    try {
      const events = localStorage.getItem(this.storageKey);
      return events ? JSON.parse(events) : {};
    } catch (error) {
      console.error('Error parsing events from localStorage:', error);
      return {};
    }
  }

  saveEvent(event) {
    const events = this.getEvents();

    // Crear identificador único para el evento (usar el parámetro event, no this.event)
    const userIdentifier = event.password;

    if (events[userIdentifier]) {
      console.error(`User with Password ${userIdentifier} already exists.`);
      return false; // Devolver false para indicar fallo
    }

    events[userIdentifier] = event;
    localStorage.setItem(this.storageKey, JSON.stringify(events));
    console.log(`Event "${event.name}" saved successfully.`);
    return true; // Devolver true para indicar éxito
  }
  /*saveEvent(event) {
    const events = this.getEvents();

    // Crear identificador único para el evento
    const userIdentifier = event.password;

    if (events[userIdentifier]) {
      console.error(`User with Password ${userIdentifier} already exists.`);
      return;
    }

    events[userIdentifier] = event;
    localStorage.setItem(this.storageKey, JSON.stringify(events));
    console.log(`Event "${event.name}" saved successfully.`);
  }
  */
  deleteEvent(userIdentifier) {
    const events = this.getEvents();
    delete events[userIdentifier];
    localStorage.setItem(this.storageKey, JSON.stringify(events));
    console.log(`Event deleted successfully.`);
  }
}
