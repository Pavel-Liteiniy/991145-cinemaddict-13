import AbstractView from "./abstract";

const createMoviesSort = () => {
  return `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

export default class MoviesSort extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createMoviesSort();
  }
}
