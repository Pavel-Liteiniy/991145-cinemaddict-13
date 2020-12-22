import {SortType, UserAction, UpdateType, FilterType} from "../const";
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
  constructor(filmsContainer, moviesModel, filterModel) {
    this._filmsContainer = filmsContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._cardsCount = CARDS_COUNT;
    this._renderedFilms = this._cardsCount;
    this._cardsExtraCount = CARDS_EXTRA_COUNT;
    this._typeExtraFilms = TypeExtraFilms;
    this._allMoviesPresenters = new Map();
    this._topRatedMoviesPresenters = new Map();
    this._mostCommentedMoviesPresenters = new Map();

    this._topRatedFilms = [];
    this._mostCommentedFilms = [];
    this._filterSelected = FilterType.ALL;
    this._sortTypeSelected = SortType.BY_DEFAULT;

    this._popupComponent = new PopupView();
    this._filmsWrapperComponent = new FilmsWrapperView();
    this._moviesSortComponent = new MoviesSortView();
    this._showButtonComponent = new ShowButtonView();
    this._filmsCatalogComponent = null;

    this._showButtonClickHandler = this._showButtonClickHandler.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {

    this._moviesSortComponent.updateData({sortTypeSelected: this._sortTypeSelected}, true);
    this._moviesSortComponent.setClickHandler(this._handleSortTypeChange);
    render(this._filmsContainer, this._moviesSortComponent);

    render(this._filmsContainer, this._filmsWrapperComponent);

    this._renderMoviesListAll();

    render(this._filmsWrapperComponent, this._filmsCatalogComponent);
    this._renderMovieListsExtra();
  }

  _getMovies() {
    let movies = this._moviesModel.getMovies().slice();

    switch (this._filterSelected) {
      case FilterType.WATCHLIST:
        movies = movies.filter((movie) => {
          return movie.inWatchListCollection;
        });
        break;
      case FilterType.HISTORY:
        movies = movies.filter((movie) => {
          return movie.inWatchedCollection;
        });
        break;
      case FilterType.FAVORITES:
        movies = movies.filter((movie) => {
          return movie.inFavoriteCollection;
        });
        break;
    }

    switch (this._sortTypeSelected) {
      case SortType.BY_RATING:
        movies.sort(({rating: a}, {rating: b}) => {
          return b - a;
        });
        break;
      case SortType.BY_DATE:
        movies.sort(({date: a}, {date: b}) => {
          return b - a;
        });
        break;
    }

    return movies;
  }

  _renderMoviesAllContainer() {
    const prevFilmsCatalogComponent = this._filmsCatalogComponent;

    this._filmsCatalogComponent = new FilmsCatalogView();
    this._filmsCatalogComponent.setFilms(this._getMovies());
    this._filmsCardContainer = this._filmsCatalogComponent.getElement().querySelector(`.films-list__container`);

    if (prevFilmsCatalogComponent === null) {
      render(this._filmsWrapperComponent, this._filmsCatalogComponent);
      return;
    }

    if (this._filmsWrapperComponent.getElement().contains(prevFilmsCatalogComponent.getElement())) {
      replace(this._filmsCatalogComponent, prevFilmsCatalogComponent);
    }

    remove(prevFilmsCatalogComponent);
  }

  _renderMoviesListAll() {
    this._renderMoviesAllContainer();
    this._renderFilmCardElements(this._filmsCardContainer, this._getMovies().slice(0, this._renderedFilms));

    if (this._getMovies().length > this._renderedFilms) {
      this._renderShowButton();
    }
  }

  _renderShowButton() {
    this._showButtonComponent.setClickHandler(this._showButtonClickHandler);
    render(this._filmsCatalogComponent, this._showButtonComponent);
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
    const moviesCount = this._getMovies().length;
    const newRenderedFilms = Math.min(moviesCount, this._renderedFilms + this._cardsCount);

    this._renderFilmCardElements(this._filmsCardContainer, this._getMovies().slice(this._renderedFilms, newRenderedFilms));
    this._renderedFilms = newRenderedFilms;

    if (this._renderedFilms >= moviesCount) {
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

  _renderTopRatedFilms(componentContainer, movies) {
    render(this._filmsWrapperComponent, componentContainer);
    const componentFilmsContainer = componentContainer.getElement().querySelector(`.films-list__container`);

    if (componentFilmsContainer) {
      movies.map((movie) => {
        const filmComponent = new MoviePresenter(componentFilmsContainer, this._popupComponent, this._handleViewAction);
        filmComponent.init(movie);
        this._topRatedMoviesPresenters.set(movie.id, filmComponent);
      });
    }
  }

  _renderMostCommentedFilms(componentContainer, movies) {
    render(this._filmsWrapperComponent, componentContainer);
    const componentFilmsContainer = componentContainer.getElement().querySelector(`.films-list__container`);

    if (componentFilmsContainer) {
      movies.map((movie) => {
        const filmComponent = new MoviePresenter(componentFilmsContainer, this._popupComponent, this._handleViewAction);
        filmComponent.init(movie);
        this._mostCommentedMoviesPresenters.set(movie.id, filmComponent);
      });
    }
  }

  _createExtraFilmsElement(movies, typeExtraFilms) {
    switch (typeExtraFilms) {
      case this._typeExtraFilms.TOP_RATED:
        this._topRatedFilms = this._getTopRatedFilms(movies, this._cardsExtraCount);
        this._topRatedComponent = new TopRatedFilmsView(this._topRatedFilms);
        this._renderTopRatedFilms(this._topRatedComponent, this._topRatedFilms);
        break;
      case this._typeExtraFilms.MOST_COMMENTED:
        this._mostCommentedFilms = this._getMostCommentedFilms(movies, this._cardsExtraCount);
        this._mostCommentedComponent = new MostCommentedFilmsView(this._mostCommentedFilms);
        this._renderMostCommentedFilms(this._mostCommentedComponent, this._mostCommentedFilms);
        break;
    }
  }

  _handleViewAction(userAction, update) {
    switch (userAction) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(UpdateType.MINOR, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearAllMoviesList();
        this._renderMoviesListAll();

        if (this._topRatedMoviesPresenters.has(data.id)) {
          this._topRatedMoviesPresenters.get(data.id).init(data);
        }
        if (this._mostCommentedMoviesPresenters.has(data.id)) {
          this._mostCommentedMoviesPresenters.get(data.id).init(data);
        }
        break;
      case UpdateType.MAJOR:
        this._filterSelected = data;
        this._sortTypeSelected = SortType.BY_DEFAULT;
        this._moviesSortComponent.updateData({sortTypeSelected: this._sortTypeSelected});
        this._clearAllMoviesList();
        this._renderedFilms = this._cardsCount;
        this._renderMoviesListAll();
        break;
    }
  }

  _handleSortTypeChange(newSortType) {
    if (newSortType !== this._sortTypeSelected) {
      this._sortTypeSelected = newSortType;
      this._moviesSortComponent.updateData({sortTypeSelected: this._sortTypeSelected});

      this._clearAllMoviesList();
      this._renderMoviesListAll();
    }
  }

  _clearAllMoviesList() {
    this._allMoviesPresenters.forEach((presenter) => presenter.destroy());
    this._allMoviesPresenters.clear();
    remove(this._showButtonComponent);
  }
}
