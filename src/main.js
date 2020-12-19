import {render} from "./utils/render";
import UserRankView from "./view/user-rank";
import MenuView from "./view/menu";
import MoviesStatisticView from "./view/movies-statistic";
import {generateFilm} from "./mock/film";
import {generateUser} from "./mock/user";
import MovieListPresenter from "./presenter/movie-list";
import MoviesModel from "./model/movies";

const FILMS_NUMBER = 20;
const films = new Array(FILMS_NUMBER).fill().map(generateFilm);
const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const user = generateUser();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterStatisticElement = siteBodyElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, new UserRankView(user));
render(siteMainElement, new MenuView(user));

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel);
movieListPresenter.init();

render(siteFooterStatisticElement, new MoviesStatisticView(films));
