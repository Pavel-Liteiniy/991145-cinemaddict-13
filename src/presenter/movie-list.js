import {SortType, UserAction, UpdateType} from "../const";
import {remove, render, replace} from "../utils/render";
import FilmsWrapperView from "../view/films-wrapper";
import FilmsCatalogView from "../view/films-catalog";
import MoviesSortView from "../view/sort";
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
  constructor(filmsContainer, moviesModel) {
    this._filmsContainer = filmsContainer;
    this._moviesModel = moviesModel;
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
    this._filmsCatalogComponent = new FilmsCatalogView(this._getMovies());

    this._showButtonClickHandler = this._showButtonClickHandler.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filmsCardContainer = this._filmsCatalogComponent.getElement().querySelector(`.films-list__container`);

    this._moviesSortComponent.setClickHandler(this._handleSortTypeChange);
    render(this._filmsContainer, this._moviesSortComponent);

    render(this._filmsContainer, this._filmsWrapperComponent);
    render(this._filmsWrapperComponent, this._filmsCatalogComponent);

    this._renderedFilms = this._cardsCount;
    this._renderMoviesListAll();
    this._renderMovieListsExtra();
  }

  _getMovies() {
    const defaultMovies = this._moviesModel.getMovies().slice();

    switch (this._sortTypeSelected) {
      case SortType.BY_RATING:
        defaultMovies.sort(({rating: a}, {rating: b}) => {
          return b - a;
        });
        break;
      case SortType.BY_DATE:
        defaultMovies.sort(({date: a}, {date: b}) => {
          return b - a;
        });
        break;
    }

    return defaultMovies;
  }

  _renderMoviesListAll() {
    this._renderFilmCardElements(this._filmsCardContainer, this._getMovies().slice(0, this._cardsCount));

    if (this._renderedFilms < this._getMovies().length) {
      render(this._filmsCatalogComponent, this._showButtonComponent);
      this._showButtonComponent.setClickHandler(this._showButtonClickHandler);
    }
  }

  _renderMovieListsExtra() {
    this._createExtraFilmsElement(this._getMovies(), this._typeExtraFilms.TOP_RATED);
    this._createExtraFilmsElement(this._getMovies(), this._typeExtraFilms.MOST_COMMENTED);
  }

  _renderFilmCardElements(container, movies) {
    movies.map((movie) => {
      const filmComponent = new MoviePresenter(container, this._popupComponent, this._handleViewAction);
      filmComponent.init(movie);
      this._allMoviesPresenters.set(movie.id, filmComponent);
    });
  }

  _showButtonClickHandler() {
    this._renderFilmCardElements(this._filmsCardContainer, this._getMovies().slice(this._renderedFilms, this._renderedFilms + this._cardsCount));
    this._renderedFilms += this._cardsCount;

    if (this._renderedFilms >= this._getMovies().length) {
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
        const filmComponent = new MoviePresenter(componentFilmsContainer, this._popupComponent, this._handleViewAction);
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

  _handleViewAction(userAction, update) {
    switch (userAction) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(UpdateType.PATCH, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._allMoviesPresenters.has(data.id)) {
          this._allMoviesPresenters.get(data.id).init(data);
        }

        if (this._extraMoviesPresenters.has(data.id)) {
          this._extraMoviesPresenters.get(data.id).init(data);
        }
        break;
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

      this._clearAllMoviesList();
      this._renderMoviesListAll();
    }
  }

  _clearAllMoviesList() {
    this._allMoviesPresenters.forEach((presenter) => presenter.destroy());
    this._allMoviesPresenters.clear();
    this._renderedFilms = this._cardsCount;
    remove(this._showButtonComponent);
  }
}
