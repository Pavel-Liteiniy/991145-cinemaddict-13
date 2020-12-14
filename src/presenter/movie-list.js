import {SortType} from "../const";
import {remove, render, replace} from "../utils/render";
import FilmsWrapperView from "../view/films-wrapper";
import FilmsCatalogView from "../view/films-catalog";
import MoviesSortView from "../view/sort";
import ShowButtonView from "../view/show-button";
import PopupView from "../view/popup";
import TopRatedFilmsView from "../view/top-rated-films";
import MostCommentedFilmsView from "../view/most-commented-films";
import MoviePresenter from "./movie";
import {updateItem} from '../utils/common';

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
    this._allMoviesPresenters = new Map();
    this._extraMoviesPresenters = new Map();

    this._topRatedFilms = [];
    this._mostCommentedFilms = [];
    this._sortTypeSelected = SortType.BY_DEFAULT;

    this._popupComponent = new PopupView();
    this._filmsWrapperComponent = new FilmsWrapperView();
    this._moviesSortComponent = new MoviesSortView(this._sortTypeSelected);
    this._showButtonComponent = new ShowButtonView();

    this._showButtonClickHandler = this._showButtonClickHandler.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._filmsCatalogComponent = new FilmsCatalogView(this._films);
    this._filmsCardContainer = this._filmsCatalogComponent.getElement().querySelector(`.films-list__container`);

    this._moviesSortComponent.setClickHandler(this._handleSortTypeChange);
    render(this._filmsContainer, this._moviesSortComponent);

    render(this._filmsContainer, this._filmsWrapperComponent);
    render(this._filmsWrapperComponent, this._filmsCatalogComponent);

    this._renderedFilms = this._cardsCount;
    this._renderAllMoviesList();

    this._renderExtraFilmsLists();
  }

  _renderAllMoviesList() {
    this._renderFilmCardElements(this._filmsCardContainer, this._films.slice(0, this._cardsCount));

    if (this._renderedFilms < this._films.length) {
      render(this._filmsCatalogComponent, this._showButtonComponent);
      this._showButtonComponent.setClickHandler(this._showButtonClickHandler);
    }
  }

  _renderExtraFilmsLists() {
    this._createExtraFilmsElement(this._films, this._typeExtraFilms.TOP_RATED);
    this._createExtraFilmsElement(this._films, this._typeExtraFilms.MOST_COMMENTED);
  }

  _renderFilmCardElements(container, movies) {
    movies.map((movie) => {
      const filmComponent = new MoviePresenter(container, this._popupComponent, this._handleFilmChange);
      filmComponent.init(movie);
      this._allMoviesPresenters.set(movie.id, filmComponent);
    });
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
      movies.map((movie) => {
        const filmComponent = new MoviePresenter(componentFilmsContainer, this._popupComponent, this._handleFilmChange);
        filmComponent.init(movie);
        this._extraMoviesPresenters.set(movie.id, filmComponent);
      });
    }
  }

  _createExtraFilmsElement(movies, typeExtraFilms) {
    switch (typeExtraFilms) {
      case this._typeExtraFilms.TOP_RATED:
        this._topRatedFilms = this._getTopRatedFilms(movies, this._cardsExtraCount);
        this._topRatedComponent = new TopRatedFilmsView(this._topRatedFilms);
        this._renderExtraFilms(this._topRatedComponent, this._topRatedFilms);
        break;
      case this._typeExtraFilms.MOST_COMMENTED:
        this._mostCommentedFilms = this._getMostCommentedFilms(movies, this._cardsExtraCount);
        this._mostCommentedComponent = new MostCommentedFilmsView(this._mostCommentedFilms);
        this._renderExtraFilms(this._mostCommentedComponent, this._mostCommentedFilms);
        break;
    }
  }

  _handleFilmChange(film) {
    this._films = updateItem(this._films, film);

    if (this._allMoviesPresenters.has(film.id)) {
      this._allMoviesPresenters.get(film.id).init(film);
    }

    if (this._extraMoviesPresenters.has(film.id)) {
      this._extraMoviesPresenters.get(film.id).init(film);
    }
  }

  _handleSortTypeChange(newSortType) {
    if (newSortType !== this._sortTypeSelected) {
      const prevMoviesSortComponent = this._moviesSortComponent;
      this._sortTypeSelected = newSortType;
      this._moviesSortComponent = new MoviesSortView(this._sortTypeSelected);
      this._moviesSortComponent.setClickHandler(this._handleSortTypeChange);

      if (this._filmsContainer.contains(prevMoviesSortComponent.getElement())) {
        replace(this._moviesSortComponent, prevMoviesSortComponent);
      }

      remove(prevMoviesSortComponent);

      this._sortFilms(newSortType);
      this._clearAllMoviesList();
      this._renderAllMoviesList();
    }
  }

  _sortFilms(newSortType) {
    switch (newSortType) {
      case SortType.BY_RATING:
        this._films.sort(({rating: a}, {rating: b}) => {
          return b - a;
        });
        break;
      case SortType.BY_DATE:
        this._films.sort(({date: a}, {date: b}) => {
          return b - a;
        });
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._sortTypeSelected = newSortType;
  }

  _clearAllMoviesList() {
    this._allMoviesPresenters.forEach((presenter) => presenter.destroy());
    this._allMoviesPresenters.clear();
    this._renderedFilms = this._cardsCount;
    remove(this._showButtonComponent);
  }
}
