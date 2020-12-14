import {remove, render, replace} from "../utils/render";
import MovieCardView from "../view/film-card";

const KEY_ESCAPE = `Escape`;
const KEY_ESC = `Esc`;

export default class Movie {
  constructor(movieContainer, popupComponent, handleFilmChange) {
    this._bodyElement = document.querySelector(`body`);
    this._movieCardComponent = null;

    this._movieContainer = movieContainer;
    this._popupComponent = popupComponent;
    this._handleFilmChange = handleFilmChange;

    this._movieCardClickHandler = this._movieCardClickHandler.bind(this);
    this._movieCardClickButtonHandler = this._movieCardClickButtonHandler.bind(this);
    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
    this._popupClickHandler = this._popupClickHandler.bind(this);
    this._popupClickButtonHandler = this._popupClickButtonHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevMovieCardComponent = this._movieCardComponent;

    this._movieCardComponent = new MovieCardView(this._film);
    this._movieCardComponent.setClickHandler(this._movieCardClickHandler);
    this._movieCardComponent.setClickButtonHandler(this._movieCardClickButtonHandler);

    if (prevMovieCardComponent === null) {
      render(this._movieContainer, this._movieCardComponent);
      return;
    }

    if (this._movieContainer.contains(prevMovieCardComponent.getElement())) {
      replace(this._movieCardComponent, prevMovieCardComponent);
    }

    remove(prevMovieCardComponent);
  }

  destroy() {
    remove(this._movieCardComponent);
  }

  _movieCardClickHandler() {
    this._popupComponent.setFilm(this._film);
    this._popupComponent.setClickHandler(this._popupClickHandler);
    this._popupComponent.setClickButtonHandler(this._popupClickButtonHandler);

    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
    this._bodyElement.classList.add(`hide-overflow`);

    render(this._bodyElement, this._popupComponent);
  }

  _movieCardClickButtonHandler(film) {
    this._handleFilmChange(film);
  }

  _popupClickHandler() {
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    this._bodyElement.classList.remove(`hide-overflow`);
    remove(this._popupComponent);
  }

  _popupClickButtonHandler(film) {
    this._handleFilmChange(film);
  }

  _popupEscKeyDownHandler(evt) {
    if (evt.key === KEY_ESCAPE || evt.key === KEY_ESC) {
      evt.preventDefault();
      this._popupClickHandler();
    }
  }
}
