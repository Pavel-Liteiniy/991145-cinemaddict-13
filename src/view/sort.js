import SmartView from "./smart";
import {SortType} from "../const";


const createMoviesSort = (sortTypeSelected = SortType.BY_DEFAULT) => {
  return `<ul class="sort">
  <li><a href="#" class="sort__button${sortTypeSelected === SortType.BY_DEFAULT ? ` sort__button--active` : ``}" data-sort-type="default">Sort by default</a></li>
  <li><a href="#" class="sort__button${sortTypeSelected === SortType.BY_DATE ? ` sort__button--active` : ``}" data-sort-type="date">Sort by date</a></li>
  <li><a href="#" class="sort__button${sortTypeSelected === SortType.BY_RATING ? ` sort__button--active` : ``}" data-sort-type="rating">Sort by rating</a></li>
  </ul>`;
};

export default class MoviesSort extends SmartView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createMoviesSort(this._data.sortTypeSelected);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    if (evt.target.classList.contains(`sort__button`)) {
      evt.preventDefault();

      this._callback.click(evt.target.dataset.sortType);
    }
  }

  restoreHandlers() {
    this.setClickHandler(this._callback.click);
  }
}
