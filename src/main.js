import {render} from "./utils/render";
import UserRankView from "./view/user-rank";
import MoviesStatisticView from "./view/movies-statistic";
import {generateFilm} from "./mock/film";
import {generateUser} from "./mock/user";
import MovieListPresenter from "./presenter/movie-list";
import MenuPresenter from "./presenter/menu";
import MoviesModel from "./model/movies";
import FilterModel from "./model/filter";

const FILMS_NUMBER = 20;
const films = new Array(FILMS_NUMBER).fill().map(generateFilm);

const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const filterModel = new FilterModel();

const user = generateUser();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterStatisticElement = siteBodyElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, new UserRankView(user));

const menuPresenter = new MenuPresenter(siteMainElement, moviesModel, filterModel);
menuPresenter.init();

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
movieListPresenter.init();

render(siteFooterStatisticElement, new MoviesStatisticView(films));
