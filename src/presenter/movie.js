import {remove, render} from "../utils/render";
import MovieCardView from "../view/film-card";

export default class Movie {
  constructor(movieContainer, popupComponent) {
    this._bodyElement = document.querySelector(`body`);
    this._movieContainer = movieContainer;

    this._popupComponent = popupComponent;

    this._movieCardClickHandler = this._movieCardClickHandler.bind(this);
    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
    this._popupClickHandler = this._popupClickHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._movieCardComponent = new MovieCardView(this._film);
    this._movieCardComponent.setClickHandler(this._movieCardClickHandler);
    render(this._movieContainer, this._movieCardComponent);
  }

  _movieCardClickHandler() {
    this._popupComponent.setFilm(this._film);
    this._popupComponent.setClickHandler(this._popupClickHandler);

    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
    this._bodyElement.classList.add(`hide-overflow`);

    render(this._bodyElement, this._popupComponent);
  }

  _popupClickHandler() {
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    this._bodyElement.classList.remove(`hide-overflow`);
    remove(this._popupComponent);
  }

  _popupEscKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._popupClickHandler();
    }
  }
}
