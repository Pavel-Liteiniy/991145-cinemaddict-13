import {createUserRank} from "./view/user-rank";
import {createMenu} from "./view/menu";
import {createFilmCard} from "./view/film-card";
import {createContent} from "./view/content";
import {createMoviesStatistic} from "./view/movies-statistic";
import {generateFilm} from "./mock/film";

const FILMS_COUNT = 10;
const CARDS_NUMBER = 5;
const CARDS_EXTRA_NUMBER = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterStatisticElement = siteBodyElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, createUserRank());
render(siteMainElement, createMenu());
render(siteMainElement, createContent());

const filmsListElements = siteMainElement.querySelectorAll(`.films-list`);

Array.from(filmsListElements).forEach((filmsList) => {
  const filmCardcontainer = filmsList.querySelector(`.films-list__container`);

  let cardsNumber = filmsList.classList.contains(`films-list--extra`)
    ? CARDS_EXTRA_NUMBER
    : CARDS_NUMBER;

  for (let i = 0; i < cardsNumber; i++) {
    render(filmCardcontainer, createFilmCard(films[i]));
  }
});

render(siteFooterStatisticElement, createMoviesStatistic());
