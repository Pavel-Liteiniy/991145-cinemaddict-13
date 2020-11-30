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

const filmsCatalogComponent = new FilmsCatalogView(films);
const movieCardContainer = filmsCatalogComponent.getElement().querySelector(`.films-list__container`);

render(siteFilmsWrapperElement, filmsCatalogComponent.getElement());

const popupComponent = new PopupView();

const addMovieCardListeners = (cardComponent, callBack) => {
  const cardElement = cardComponent.getElement();
  const movieData = cardComponent.getFilm();

  cardElement.querySelector(`.film-card__title`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    callBack(movieData);
  });
  cardElement.querySelector(`img`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    callBack(movieData);
  });
  cardElement.querySelector(`.film-card__comments`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    callBack(movieData);
  });
};

const deletePopup = () => {
  document.removeEventListener(`keydown`, onEscKeyDown);
  siteBodyElement.classList.remove(`hide-overflow`);
  siteBodyElement.removeChild(popupComponent.getElement());
  popupComponent.removeElement();
};

const onMovieCardClick = (movieData) => {
  popupComponent.setFilm(movieData);
  const popupElement = popupComponent.getElement();

  document.addEventListener(`keydown`, onEscKeyDown);
  popupElement.querySelector(`.film-details__close-btn`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    deletePopup();
  });

  siteBodyElement.classList.add(`hide-overflow`);
  siteBodyElement.appendChild(popupElement);
};

const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    evt.preventDefault();
    deletePopup();
  }
};

const renderFilmsCatalog = (movies, cardsCount) => {
  if (renderedFilms < movies.length) {
    const fragment = document.createDocumentFragment();

    movies.slice(renderedFilms, renderedFilms + cardsCount).forEach((movie) => {
      const movieCard = new MovieCardView(movie);

      addMovieCardListeners(movieCard, onMovieCardClick);
      fragment.appendChild(movieCard.getElement());

      renderedFilms++;
    });

    render(movieCardContainer, fragment);
  }
};

let renderedFilms = 0;
renderFilmsCatalog(films, CARDS_COUNT);

if (renderedFilms < films.length) {
  const ShowButtonComponent = new ShowButtonView();
  render(filmsCatalogComponent.getElement(), ShowButtonComponent.getElement());

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

const renderFilmCardElements = (container, movies, position = `beforeend`) => {
  const fragment = document.createDocumentFragment();

  movies.map((movie) => {
    const movieCard = new MovieCardView(movie);

    addMovieCardListeners(movieCard, onMovieCardClick);
    fragment.appendChild(movieCard.getElement());
  });

  render(container, fragment, position);
};

const topRatedFilms = getTopRatedFilms(films, CARDS_EXTRA_COUNT);
const mostCommentedFilms = getMostCommentedFilms(films, CARDS_EXTRA_COUNT);

const renderExtraFilms = (component, movies) => {
  const componentFilmsContainer = component.getElement().querySelector(`.films-list__container`);
  render(siteFilmsWrapperElement, component.getElement());

  if (componentFilmsContainer) {
    renderFilmCardElements(componentFilmsContainer, movies);
  }
};

const topRatedFilmsComponent = new TopRatedFilmsView(topRatedFilms);
renderExtraFilms(topRatedFilmsComponent, topRatedFilms);

const mostCommentedFilmsComponent = new MostCommentedFilmsView(mostCommentedFilms);
renderExtraFilms(mostCommentedFilmsComponent, mostCommentedFilms);

render(siteFooterStatisticElement, new MoviesStatisticView(films).getElement());
