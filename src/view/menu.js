import AbstractView from "./abstract";
import {FilterType} from "../const.js";

const TAG_NAME_LINK = `A`;

const createMenu = ({watchlist = 0, history = 0, favorites = 0}, filterSelected = FilterType.ALL) => {
  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item${filterSelected === FilterType.ALL ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item${filterSelected === FilterType.WATCHLIST ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
    <a href="#history" class="main-navigation__item${filterSelected === FilterType.HISTORY ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history}</span></a>
    <a href="#favorites" class="main-navigation__item${filterSelected === FilterType.FAVORITES ? ` main-navigation__item--active` : ``}" data-filter="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional${filterSelected === FilterType.DISABLED ? ` main-navigation__additional--active` : ``}"  data-filter="${FilterType.DISABLED}">Stats</a>
</nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._films = null;
    this._filterSelected = null;
    this._movieCountInCollection = {};

    this._clickMenuHandler = this._clickMenuHandler.bind(this);
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

  setClickMenuHandler(callback) {
    this._callback.clickFilter = callback;

    Array.from(this.getElement().querySelectorAll(`a`)).forEach((link) => {
      link.addEventListener(`click`, this._clickMenuHandler);
    })
  }

  _clickMenuHandler(evt) {
      evt.preventDefault();
      this._callback.clickFilter(evt.currentTarget.dataset.filter);
  }
}
