import {remove, render} from "../utils/render";
import FilmsWrapperView from "../view/films-wrapper";
import FilmsCatalogView from "../view/films-catalog";
import ShowButtonView from "../view/show-button";
import PopupView from "../view/popup";
import TopRatedFilmsView from "../view/top-rated-films";
import MostCommentedFilmsView from "../view/most-commented-films";
import MoviePresenter from "./movie";

const CARDS_COUNT = 5;
const CARDS_EXTRA_COUNT = 2;
const TypeExtraFilms = {
  MOST_COMMENTED: `most commented`,
  TOP_RATED: `top rated`
};

export default class MovieList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._cardsCount = CARDS_COUNT;
    this._cardsExtraCount = CARDS_EXTRA_COUNT;
    this._typeExtraFilms = TypeExtraFilms;

    this._popupComponent = new PopupView();
    this._filmsWrapperComponent = new FilmsWrapperView();
    this._showButtonComponent = new ShowButtonView();

    this._showButtonClickHandler = this._showButtonClickHandler.bind(this);
  }

  init(films) {
    this._films = films;
    this._filmsCatalogComponent = new FilmsCatalogView(this._films);
    this._filmsCardContainer = this._filmsCatalogComponent.getElement().querySelector(`.films-list__container`);

    render(this._filmsContainer, this._filmsWrapperComponent);
    render(this._filmsWrapperComponent, this._filmsCatalogComponent);

    this._renderFilmCardElements(this._filmsCardContainer, this._films.slice(0, this._cardsCount));

    this._renderedFilms = this._cardsCount;

    if (this._renderedFilms < this._films.length) {
      render(this._filmsCatalogComponent, this._showButtonComponent);
      this._showButtonComponent.setClickHandler(this._showButtonClickHandler);
    }

    this._createExtraFilmsElement(this._films, this._typeExtraFilms.TOP_RATED);
    this._createExtraFilmsElement(this._films, this._typeExtraFilms.MOST_COMMENTED);
  }

  _renderFilmCardElements(container, movies, position = `beforeend`) {
    const fragment = document.createDocumentFragment();

    movies.map((movie) => {
      new MoviePresenter(fragment, this._popupComponent).init(movie);
    });
    render(container, fragment, position);
  }

  _showButtonClickHandler() {
    this._renderFilmCardElements(this._filmsCardContainer, this._films.slice(this._renderedFilms, this._renderedFilms + this._cardsCount));
    this._renderedFilms += this._cardsCount;

    if (this._renderedFilms >= this._films.length) {
      remove(this._showButtonComponent);
    }
  }

  _getTopRatedFilms(movies, quantity) {
    return movies.slice().sort(({rating: a}, {rating: b}) => {
      return b - a;
    }).slice(0, quantity);
  }

  _getMostCommentedFilms(movies, quantity) {
    return movies.slice().sort(({comments: a}, {comments: b}) => {
      return b.length - a.length;
    }).slice(0, quantity);
  }

  _renderExtraFilms(componentContainer, movies) {
    render(this._filmsWrapperComponent, componentContainer);
    const componentFilmsContainer = componentContainer.getElement().querySelector(`.films-list__container`);

    if (componentFilmsContainer) {
      this._renderFilmCardElements(componentFilmsContainer, movies);
    }
  }

  _createExtraFilmsElement(movies, typeExtraFilms) {
    switch (typeExtraFilms) {
      case TypeExtraFilms.TOP_RATED:
        this._extraFilms = this._getTopRatedFilms(movies, this._cardsExtraCount);
        this._extraComponent = new TopRatedFilmsView(this._extraFilms);
        break;
      case TypeExtraFilms.MOST_COMMENTED:
        this._extraFilms = this._getMostCommentedFilms(movies, this._cardsExtraCount);
        this._extraComponent = new MostCommentedFilmsView(this._extraFilms);
        break;
    }

    this._renderExtraFilms(this._extraComponent, this._extraFilms);

    this._extraFilms = null;
    this._extraComponent = null;
  }
}
