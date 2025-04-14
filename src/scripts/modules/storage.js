export class StorageModule {
  constructor(storageKey = 'events') {
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

    // Crear identificador único para el evento
    const eventIdentifier = `${event.password}-${event.name}`;

    if (events[eventIdentifier]) {
      console.error(
        `Event with identifier "${eventIdentifier}" already exists.`,
      );
      return;
    }

    events[eventIdentifier] = event;
    localStorage.setItem(this.storageKey, JSON.stringify(events));
    console.log(
      `Event "${event.name}" with password "${event.password}" saved successfully.`,
    );
  }

  deleteEvent(eventIdentifier) {
    const events = this.getEvents();
    delete events[eventIdentifier];
    localStorage.setItem(this.storageKey, JSON.stringify(events));
    console.log(
      `Event with identifier "${eventIdentifier}" deleted successfully.`,
    );
  }
}
