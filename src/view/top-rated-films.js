import {createElement} from "../utils";

const checkRating = (films) => {
  return films.some(({rating}) => {
    return rating > 0;
  });
};

const createTopRatedFilms = (films) => {
  return checkRating(films) ?
    `<section class="films-list films-list--extra">
<h2 class="films-list__title">Top rated</h2>
<div class="films-list__container"></div>
</section>`
    : `<section class="films-list films-list--extra"></section>`;
};

export default class TopRatedFilms {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createTopRatedFilms(this._films);
  }

  getElement() {
    this._element = this._element ? this._element : createElement(this.getTemplate());
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
