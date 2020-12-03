import AbstractView from "./abstract";

const DESCRIPTION_MAX_LENGTH = 140;
const DESCRIPTION_LAST_ITEM = `...`;

const getCheckedDescription = (description) => {
  return description.length > DESCRIPTION_MAX_LENGTH ? (description.slice(0, DESCRIPTION_MAX_LENGTH - 2) + DESCRIPTION_LAST_ITEM) : description;
};

const createFilmCard = ({title, poster, description, comments, rating}) => {
  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${Math.trunc(rating / 10)}.${rating % 10}</p>
  <p class="film-card__info">
    <span class="film-card__year">1936</span>
    <span class="film-card__duration">16m</span>
    <span class="film-card__genre">Cartoon</span>
  </p>
  <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
  <p class="film-card__description">${getCheckedDescription(description)}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class MovieCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._clickHandler);
    this.getElement().querySelector(`img`).addEventListener(`click`, this._clickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._film);
  }
}
