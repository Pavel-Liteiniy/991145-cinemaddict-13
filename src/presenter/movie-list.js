import {remove, render} from "../utils/render";
import FilmsWrapperView from "../view/films-wrapper";
import FilmsCatalogView from "../view/films-catalog";
import PopupView from "../view/popup";
import ShowButtonView from "../view/show-button";
import MovieCardView from "../view/film-card";

const CARDS_COUNT = 5;

export default class MovieList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;

    this._filmsWrapperComponent = new FilmsWrapperView();
    this._popupComponent = new PopupView();
    this._showButtonComponent = new ShowButtonView();

    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
    this._showButtonClickHandler = this._showButtonClickHandler.bind(this);
    this._movieCardClickHandler = this._movieCardClickHandler.bind(this);
    this._popupClickHandler = this._popupClickHandler.bind(this);
  }

  init(films) {
    this._films = films;
    this._filmsCatalogComponent = new FilmsCatalogView(this._films);
    this._filmsCardContainer = this._filmsCatalogComponent.getElement().querySelector(`.films-list__container`);

    render(this._filmsContainer, this._filmsWrapperComponent);
    render(this._filmsWrapperComponent, this._filmsCatalogComponent);

    this._renderFilmCardElements(this._filmsCardContainer, this._films.slice(0, CARDS_COUNT));

    this._renderedFilms = CARDS_COUNT;

    if (this._renderedFilms < this._films.length) {
      render(this._filmsCatalogComponent.getElement(), this._showButtonComponent);
      this._showButtonComponent.setClickHandler(this._showButtonClickHandler);
    }
  }

  _renderFilmCardElements(container, movies, position = `beforeend`) {
    const fragment = document.createDocumentFragment();

    movies.map((movie) => {
      const movieCard = new MovieCardView(movie);
      movieCard.setClickHandler(this._movieCardClickHandler);

      fragment.appendChild(movieCard.getElement());
    });

    render(container, fragment, position);
  }

  _movieCardClickHandler(movie) {
    this._popupComponent.setFilm(movie);
    this._popupComponent.setClickHandler(this._popupClickHandler);

    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
    document.querySelector(`body`).classList.add(`hide-overflow`);

    render(document.querySelector(`body`), this._popupComponent.getElement());
  }

  _popupClickHandler() {
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    document.querySelector(`body`).classList.remove(`hide-overflow`);
    remove(this._popupComponent);
  }

  _popupEscKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._popupClickHandler();
    }
  }

  _showButtonClickHandler() {
    this._renderFilmCardElements(this._filmsCardContainer, this._films.slice(this._renderedFilms, this._renderedFilms + CARDS_COUNT));
    this._renderedFilms += CARDS_COUNT;

    if (this._renderedFilms >= this._films.length) {
      this._showButtonComponent.getElement().remove();
      this._showButtonComponent.removeElement();
    }
  }
}
