import AbstractView from "./abstract";

const createMenu = ({WATCHLIST: watchlist, HISTORY: history, FAVORITES: favorites}) => {
  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
    <a href="#history" class="main-navigation__item main-navigation__item--active">History <span class="main-navigation__item-count">${history.length}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>

<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`;
};

export default class Menu extends AbstractView {
  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return createMenu(this._user);
  }
}
