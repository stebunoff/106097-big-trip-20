import AbstractView from '../framework/view/abstract-view';
import { formatDataForHuman } from '../utils/utils';

const MAX_DESTINATIONS = 3;

function getTripRoute(destinations) {
  if (destinations.length <= MAX_DESTINATIONS) {
    let template = '';
    for (let i = 0; i < destinations.length; i++) {
      if (i === destinations.length - 1) {
        template += destinations[i].title;
      }
      template += `${destinations[i].title} &mdash; `;
    }
    return template;
  }

  const firstDestination = destinations[0].title;
  const lastDestination = destinations[-1].title;
  return `${firstDestination} &mdash; ... &mdash; ${lastDestination}`;
}

function getTripDuration(events) {
  const firstEventDateStart = formatDataForHuman(events[0].start);
  const lastEventDateEnd = formatDataForHuman(events[0].end);
  return `${firstEventDateStart}&nbsp;&mdash;&nbsp;${lastEventDateEnd}`;
}

function calculateTripPrice(events) {
  let totalPrice = 0;
  events.forEach((element) => {
    totalPrice += element.price;
  });
  return totalPrice;
}

function createHeaderTemplate(events, destinations) {
  const eventsDestinations = events.map((event) => event.destinationId); // Доработать
  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripRoute(destinations)}</h1>

      <p class="trip-info__dates">${getTripDuration(events)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTripPrice(events)}</span>
    </p>
  </section>
  `;
}

export default class HeaderView extends AbstractView {
  #events = null;
  #destinations = null;

  constructor({events, destinations}) {
    super();
    this.#events = events;
    this.#destinations = destinations;
  }

  get template() {
    return createHeaderTemplate(this.#events, this.#destinations);
  }
}