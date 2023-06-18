import { getRandomEvent } from '../mock/event';
import Observable from '../framework/observable';

const EVENTS_COUNT = 9;

export default class EventModel extends Observable {
  #eventsApiService = null;
  #events = Array.from({length: EVENTS_COUNT}, getRandomEvent);

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;

    this.#eventsApiService.events.then((events) => {
      console.log(events.map(this.#adaptToClient));
    });
  }

  #adaptToClient(event) {
    const adaptedEvent = {...event,
      cost: event['base_price'],
      start: event['date_from'],
      end: event['date_to'],
      destinationId: event['destination'],
      isFavorite: event['is_favorite'],
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['destination'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

  get events() {
    return this.#events;
  }

  updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),

    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),

    ];

    this._notify(updateType);
  }
}
