import {createUserRank} from "./view/user-rank";
import {createMenu} from "./view/menu";
import {createFilmCard} from "./view/film-card";
import {createFilmsWrapper} from "./view/films-wrapper";
import {createFilmsCatalog} from "./view/films-catalog";
import {createTopRatedFilms} from "./view/top-rated-films";
import {createMostCommentedFilms} from "./view/most-commented-films";
import {createShowButton} from "./view/show-button";
import {createMoviesStatistic} from "./view/movies-statistic";
import {createPopup} from "./view/popup";
import {generateFilm} from "./mock/film";
import {generateUser} from "./mock/user";

const FILMS_NUMBER = 20;
const CARDS_COUNT = 5;
const CARDS_EXTRA_COUNT = 2;

const films = new Array(FILMS_NUMBER).fill().map(generateFilm);
const user = (generateUser());

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterStatisticElement = siteBodyElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, createUserRank(user));
render(siteMainElement, createMenu(user));
render(siteMainElement, createFilmsWrapper());

const siteFilmsWrapperElement = siteBodyElement.querySelector(`.films`);

render(siteFilmsWrapperElement, createFilmsCatalog());

const renderFilmsCatalog = (movies, cardsCount, catalog) => {
  const movieCardContainer = catalog.querySelector(`.films-list__container`);

  if (renderedFilms < movies.length) {
    movies.slice(renderedFilms, renderedFilms + cardsCount).forEach((movie) => {
      render(movieCardContainer, createFilmCard(movie));
      renderedFilms++;
    });
  }
};

const filmsCatalogElement = siteFilmsWrapperElement.querySelector(`.films-list:not(.films-list--extra)`);
let renderedFilms = 0;

renderFilmsCatalog(films, CARDS_COUNT, filmsCatalogElement);

if (renderedFilms < films.length) {
  render(filmsCatalogElement, createShowButton());
  const showButton = filmsCatalogElement.querySelector(`.films-list__show-more`);

  showButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    renderFilmsCatalog(films, CARDS_COUNT, filmsCatalogElement);

    if (renderedFilms === films.length) {
      showButton.remove();
    }
  });
}

const getTopRatedFilms = (movies, quantity) => {
  return movies.sort(({rating: a}, {rating: b}) => {
    return b - a;
  }).slice(0, quantity);
};

const getMostCommentedFilms = (movies, quantity) => {
  return movies.sort(({comments: a}, {comments: b}) => {
    return b.length - a.length;
  }).slice(0, quantity);
};

const createFilmCards = (movies) => {
  return movies.map((movie) => {
    return createFilmCard(movie);
  });
};

const topRatedFilms = getTopRatedFilms(films, CARDS_EXTRA_COUNT);
const mostCommentedFilms = getMostCommentedFilms(films, CARDS_EXTRA_COUNT);

render(siteFilmsWrapperElement, createTopRatedFilms(topRatedFilms, createFilmCards(topRatedFilms)));
render(siteFilmsWrapperElement, createMostCommentedFilms(mostCommentedFilms, createFilmCards(mostCommentedFilms)));

render(siteFooterStatisticElement, createMoviesStatistic(films));
render(siteBodyElement, createPopup(films[0]));
