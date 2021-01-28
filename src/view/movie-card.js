import dayjs from "dayjs";
import durationDayjs from "dayjs/plugin/duration";
import AbstractView from "./abstract";
import {FilmsCollection} from "../const";

dayjs.extend(durationDayjs);

const Description = {
  maxLength: 140,
  lastItem: `…`,
};

const getCheckedDescription = (description) => {
  return description.length > Description.maxLength ? (description.slice(0, Description.maxLength - 2) + Description.lastItem) : description;
};

const createFilmCard = ({title, genre, poster, description, date, duration, comments, rating, inWatchListCollection, inWatchedCollection, inFavoriteCollection}) => {
  const durationHours = dayjs.duration(duration, `minutes`).hours();
  const durationMinutes = dayjs.duration(duration, `minutes`).minutes();

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(date).year()}</span>
    <span class="film-card__duration">${durationHours ? durationHours + `h ` : ``}${durationMinutes}m</span>
    <span class="film-card__genre">${genre.join(`, `)}</span>
  </p>
  <img src="${poster}" alt="${title}" class="film-card__poster">
  <p class="film-card__description">${getCheckedDescription(description)}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
  <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${inWatchListCollection ? ` film-card__controls-item--active` : ``}" data-films-collection="add-to-watchlist" type="button">Add to watchlist</button>
  <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${inWatchedCollection ? ` film-card__controls-item--active` : ``}" data-films-collection="mark-as-watched" type="button">Mark as watched</button>
  <button class="film-card__controls-item button film-card__controls-item--favorite${inFavoriteCollection ? ` film-card__controls-item--active` : ``}" data-films-collection="mark-as-favorite" type="button">Mark as favorite</button>
</div>
</article>`;
};

export default class MovieCard extends AbstractView {
  constructor(film) {
    super();
    this._film = Object.assign({}, film);

    this._filmsCollection = FilmsCollection;

    this._clickCardHandler = this._clickCardHandler.bind(this);
    this._clickControlHandler = this._clickControlHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  setClickCardHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._clickCardHandler);
    this.getElement().querySelector(`img`).addEventListener(`click`, this._clickCardHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._clickCardHandler);
  }

  setClickControlHandler(callback) {
    this._callback.clickControl = callback;

    this.getElement().querySelector(`.film-card__controls`).addEventListener(`click`, this._clickControlHandler);
  }

  _clickCardHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._film);
  }

  _clickControlHandler(evt) {
    if (evt.target.classList.contains(`film-card__controls-item`)) {
      evt.preventDefault();

      switch (evt.target.dataset.filmsCollection) {
        case this._filmsCollection.WATCH_LIST:
          this._film.inWatchListCollection = !this._film.inWatchListCollection;
          break;
        case this._filmsCollection.WATCHED:
          this._film.inWatchedCollection = !this._film.inWatchedCollection;
          break;
        case this._filmsCollection.FAVORITE:
          this._film.inFavoriteCollection = !this._film.inFavoriteCollection;
          break;
      }

      this._callback.clickControl(this._film);
    }
  }
}
