import {FilterType, UpdateType} from "./const";
import Api from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider";
import {remove, render} from "./utils/render";
import UserRankView from "./view/user-rank";
import StatisticView from "./view/statistic";
import MoviesSummaryView from "./view/movies-summary";
import MovieListPresenter from "./presenter/movie-list";
import MenuPresenter from "./presenter/menu";
import MoviesModel from "./model/movies";
import FilterModel from "./model/filter";

const AUTHORIZATION = `Basic b1xzmf1k0zj8v7jvzi59`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict/`;

const MOVIES_STORE_PREFIX = `movies-cinemaddict-localstorage`;
const MOVIES_STORE_VER = `v1.0.0`;
const MOVIES_STORE_NAME = `${MOVIES_STORE_PREFIX}-${MOVIES_STORE_VER}`;

const COMMENTS_STORE_PREFIX = `comments-cinemaddict-localstorage`;
const COMMENTS_STORE_VER = `v1.0.0`;
const COMMENTS_STORE_NAME = `${COMMENTS_STORE_PREFIX}-${COMMENTS_STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const moviesStore = new Store(MOVIES_STORE_NAME, window.localStorage);
const commentsStore = new Store(COMMENTS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, moviesStore, commentsStore);

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
const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel, apiWithProvider);

const handleMenuItemChange = (updateType, menuItem) => {
  if (updateType === UpdateType.MAJOR && prevMenuItemSelected !== menuItem) {

    if (menuItem === FilterType.DISABLED) {
      movieListPresenter.destroy();
      statisticComponent.films = moviesModel.collection.slice();
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

apiWithProvider.getMovies()
.then((movies) => {
  moviesModel.collection = {updateType: UpdateType.INIT, movies};
  render(siteFooterStatisticElement, new MoviesSummaryView(movies));

  userRankComponent.setWatchedMoviesCount(moviesModel.getMovieCountInCollection().history);
  render(siteHeaderElement, userRankComponent);

  menuPresenter.init();
})
.catch(() => {
  moviesModel.collection = {updateType: UpdateType.INIT, movies: []};
  render(siteFooterStatisticElement, new MoviesSummaryView([]));
});

filterModel.addObserver(handleMenuItemChange);
moviesModel.addObserver(handleUserRankChange);

menuPresenter.init();
movieListPresenter.init();

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/service-worker.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
