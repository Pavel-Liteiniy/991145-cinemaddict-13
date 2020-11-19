import {createUserRank} from "./view/user-rank";
import {createMenu} from "./view/menu";
import {createFilmCard} from "./view/film-card";
import {createContent} from "./view/content";
import {createMoviesStatistic} from "./view/movies-statistic";

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

filmsListElements.forEach((filmsList) => {
  const filmCardcontainer = filmsList.querySelector(`.films-list__container`);
  let cardsNumber = 5;

  if (filmsList.classList.contains(`films-list--extra`)) {
    cardsNumber = 2;
  }

  for (let i = 0; i < cardsNumber; i++) {
    render(filmCardcontainer, createFilmCard());
  }
});

render(siteFooterStatisticElement, createMoviesStatistic());
