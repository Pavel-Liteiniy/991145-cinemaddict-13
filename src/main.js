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

const FILMS_NUMBER = 2;
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

const filmsCatalogComponent = new FilmsCatalogView(films);
const movieCardContainer = filmsCatalogComponent.getElement().querySelector(`.films-list__container`);

render(siteFilmsWrapperElement, filmsCatalogComponent.getElement());

const popupComponent = new PopupView();
const ShowButtonComponent = new ShowButtonView();

const deletePopup = () => {
  document.removeEventListener(`keydown`, onEscKeyDown);
  siteBodyElement.classList.remove(`hide-overflow`);
  siteBodyElement.removeChild(popupComponent.getElement());
  popupComponent.removeElement();
};

const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    evt.preventDefault();
    deletePopup();
  }
};

const movieCardClickHandler = (movie) => {
  popupComponent.setFilm(movie);
  popupComponent.setClickHandler(deletePopup);

  document.addEventListener(`keydown`, onEscKeyDown);

  siteBodyElement.classList.add(`hide-overflow`);
  render(siteBodyElement, popupComponent.getElement());
};

const renderFilmCardElements = (container, movies, position = `beforeend`) => {
  const fragment = document.createDocumentFragment();

  movies.map((movie) => {
    const movieCard = new MovieCardView(movie);
    movieCard.setClickHandler(movieCardClickHandler);

    fragment.appendChild(movieCard.getElement());
  });

  render(container, fragment, position);
};

const showButtonClickHandler = () => {
  renderFilmCardElements(movieCardContainer, films.slice(renderedFilms, renderedFilms + CARDS_COUNT));
  renderedFilms += CARDS_COUNT;

  if (renderedFilms >= films.length) {
    ShowButtonComponent.getElement().remove();
    ShowButtonComponent.removeElement();
  }
};

renderFilmCardElements(movieCardContainer, films.slice(0, CARDS_COUNT));
let renderedFilms = CARDS_COUNT;

if (renderedFilms < films.length) {
  render(filmsCatalogComponent.getElement(), ShowButtonComponent.getElement());
  ShowButtonComponent.setClickHandler(showButtonClickHandler);
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

const topRatedFilms = getTopRatedFilms(films, CARDS_EXTRA_COUNT);
const mostCommentedFilms = getMostCommentedFilms(films, CARDS_EXTRA_COUNT);

const renderExtraFilms = (component, movies) => {
  render(siteFilmsWrapperElement, component.getElement());
  const componentFilmsContainer = component.getElement().querySelector(`.films-list__container`);

  if (componentFilmsContainer) {
    renderFilmCardElements(componentFilmsContainer, movies);
  }
};

const topRatedFilmsComponent = new TopRatedFilmsView(topRatedFilms);
renderExtraFilms(topRatedFilmsComponent, topRatedFilms);

const mostCommentedFilmsComponent = new MostCommentedFilmsView(mostCommentedFilms);
renderExtraFilms(mostCommentedFilmsComponent, mostCommentedFilms);

render(siteFooterStatisticElement, new MoviesStatisticView(films).getElement());
