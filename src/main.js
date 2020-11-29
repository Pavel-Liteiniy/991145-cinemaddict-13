import {render} from "./utils";
import UserRankView from "./view/user-rank";
import MenuView from "./view/menu";
import MovieCardView from "./view/film-card";
import FilmsWrapperView from "./view/films-wrapper";
import FilmsCatalogView from "./view/films-catalog";
import TopRatedFilmsView from "./view/top-rated-films";
import MostCommentedFilmsView from "./view/most-commented-films";
import ShowButtonView from "./view/show-button";
import MoviesStatisticView from "./view/movies-statistic";
import PopupView from "./view/popup";
import {generateFilm} from "./mock/film";
import {generateUser} from "./mock/user";

const FILMS_NUMBER = 20;
const CARDS_COUNT = 5;
const CARDS_EXTRA_COUNT = 2;

const films = new Array(FILMS_NUMBER).fill().map(generateFilm);
const user = (generateUser());

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterStatisticElement = siteBodyElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, new UserRankView(user).getElement());
render(siteMainElement, new MenuView(user).getElement());
render(siteMainElement, new FilmsWrapperView(user).getElement());

const siteFilmsWrapperElement = siteBodyElement.querySelector(`.films`);

const FilmsCatalogComponent = new FilmsCatalogView();
const movieCardContainer = FilmsCatalogComponent.getElement().querySelector(`.films-list__container`);

render(siteFilmsWrapperElement, FilmsCatalogComponent.getElement());

const renderFilmsCatalog = (movies, cardsCount) => {
  if (renderedFilms < movies.length) {
    movies.slice(renderedFilms, renderedFilms + cardsCount).forEach((movie) => {
      render(movieCardContainer, new MovieCardView(movie).getElement());
      renderedFilms++;
    });
  }
};

let renderedFilms = 0;
renderFilmsCatalog(films, CARDS_COUNT);

if (renderedFilms < films.length) {
  const ShowButtonComponent = new ShowButtonView();
  render(FilmsCatalogComponent.getElement(), ShowButtonComponent.getElement());

  ShowButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    renderFilmsCatalog(films, CARDS_COUNT);

    if (renderedFilms === films.length) {
      ShowButtonComponent.getElement().remove();
      ShowButtonComponent.removeElement();
    }
  });
}

const getTopRatedFilms = (movies, quantity) => {
  return movies.slice().sort(({rating: a}, {rating: b}) => {
    return b - a;
  }).slice(0, quantity);
};

const getMostCommentedFilms = (movies, quantity) => {
  return movies.slice().sort(({comments: a}, {comments: b}) => {
    return b.length - a.length;
  }).slice(0, quantity);
};

const createFilmCards = (movies) => {
  return movies.map((movie) => {
    return new MovieCardView(movie).getTemplate();
  });
};

const topRatedFilms = getTopRatedFilms(films, CARDS_EXTRA_COUNT);
const mostCommentedFilms = getMostCommentedFilms(films, CARDS_EXTRA_COUNT);

render(siteFilmsWrapperElement, new TopRatedFilmsView(topRatedFilms, createFilmCards(topRatedFilms)).getElement());
render(siteFilmsWrapperElement, new MostCommentedFilmsView(mostCommentedFilms, createFilmCards(mostCommentedFilms)).getElement());

render(siteFooterStatisticElement, new MoviesStatisticView(films).getElement());
