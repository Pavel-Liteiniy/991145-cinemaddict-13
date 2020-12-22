import AbstractView from "./abstract";
import {FilterType} from "../const.js";

const createMenu = ({watchlist = 0, history = 0, favorites = 0}, filterSelected = FilterType.ALL) => {
  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item${filterSelected === FilterType.ALL ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item${filterSelected === FilterType.WATCHLIST ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
    <a href="#history" class="main-navigation__item${filterSelected === FilterType.HISTORY ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history}</span></a>
    <a href="#favorites" class="main-navigation__item${filterSelected === FilterType.FAVORITES ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._films = null;
    this._filterSelected = null;
    this._movieCountInCollection = {};

    this._clickFilterHandler = this._clickFilterHandler.bind(this);
  }

  getTemplate() {
    return createMenu(this._movieCountInCollection, this._filterSelected);
  }

  setMovieCountInCollection(movieCountInCollection) {
    this._movieCountInCollection = movieCountInCollection;
  }

  setActiveFilter(activeFilter) {
    this._filterSelected = activeFilter;
  }

  setClickFilterHandler(callback) {
    this._callback.clickFilter = callback;

    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._clickFilterHandler);
  }

  _clickFilterHandler(evt) {
    if (evt.target.classList.contains(`main-navigation__item`)) {
      this._callback.clickFilter(evt.target.dataset.filter);
    }
  }
}
