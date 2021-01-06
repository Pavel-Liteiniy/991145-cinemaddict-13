import {FilterType, UpdateType} from "./const";
import {remove, render} from "./utils/render";
import UserRankView from "./view/user-rank";
import StatisticView from "./view/statistic";
import MoviesSummaryView from "./view/movies-statistic";
import {generateFilm} from "./mock/film";
import MovieListPresenter from "./presenter/movie-list";
import MenuPresenter from "./presenter/menu";
import MoviesModel from "./model/movies";
import FilterModel from "./model/filter";

const FILMS_NUMBER = 20;
let prevMenuItemSelected = null;
const films = new Array(FILMS_NUMBER).fill().map(generateFilm);

const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const filterModel = new FilterModel();

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

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterStatisticElement = siteBodyElement.querySelector(`.footer__statistics`);


const statisticComponent = new StatisticView();
const userRankComponent = new UserRankView();
userRankComponent.setWatchedMoviesCount(moviesModel.getMovieCountInCollection().history);

render(siteHeaderElement, userRankComponent);

const menuPresenter = new MenuPresenter(siteMainElement, moviesModel, filterModel);
menuPresenter.init();


const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
movieListPresenter.init();

render(siteFooterStatisticElement, new MoviesSummaryView(films));


