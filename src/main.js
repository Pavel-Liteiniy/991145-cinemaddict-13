import {FilterType, UpdateType} from "./const";
import Api from "./api";
import {remove, render} from "./utils/render";
import UserRankView from "./view/user-rank";
import StatisticView from "./view/statistic";
import MoviesSummaryView from "./view/movies-statistic";
import MovieListPresenter from "./presenter/movie-list";
import MenuPresenter from "./presenter/menu";
import MoviesModel from "./model/movies";
import FilterModel from "./model/filter";

const AUTHORIZATION = `Basic b1xzmf1k0zj8v7jvzi59`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict/`;

const api = new Api(END_POINT, AUTHORIZATION);

let prevMenuItemSelected = null;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterStatisticElement = siteBodyElement.querySelector(`.footer__statistics`);

const statisticComponent = new StatisticView();
const userRankComponent = new UserRankView();

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const menuPresenter = new MenuPresenter(siteMainElement, moviesModel, filterModel);

api.getMovies()
  .then((movies) => {

    movies = movies.map((movie) => {
      return api.getComments(movie)
        .then((comments) => {
          return Object.assign({}, movie, {comments});
        });
    });

    Promise.all(movies)
    .then((films) => {
      moviesModel.setMovies(UpdateType.INIT, films);
      render(siteFooterStatisticElement, new MoviesSummaryView(films));

      userRankComponent.setWatchedMoviesCount(moviesModel.getMovieCountInCollection().history);
      render(siteHeaderElement, userRankComponent);

      menuPresenter.init();
    })
    .catch(() => {
      throw new Error(`Can't get comments for all or someone of the films`);
    });
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    render(siteFooterStatisticElement, new MoviesSummaryView([]));
  });

const handleMenuItemChange = (updateType, menuItem) => {
  if (updateType === UpdateType.MAJOR && prevMenuItemSelected !== menuItem) {

    if (menuItem === FilterType.DISABLED) {
      movieListPresenter.destroy();
      statisticComponent.setFilms(moviesModel.getMovies().slice());
      render(siteMainElement, statisticComponent);
    }

    if (prevMenuItemSelected === FilterType.DISABLED) {
      remove(statisticComponent);
      movieListPresenter.init();
    }

    prevMenuItemSelected = menuItem;
  }
};

const handleUserRankChange = () => {
  userRankComponent.setWatchedMoviesCount(moviesModel.getMovieCountInCollection().history);
  remove(userRankComponent);
  render(siteHeaderElement, userRankComponent);
};

filterModel.addObserver(handleMenuItemChange);
moviesModel.addObserver(handleUserRankChange);

menuPresenter.init();

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
movieListPresenter.init();
