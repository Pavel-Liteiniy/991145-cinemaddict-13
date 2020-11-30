import {createElement} from "../utils";

const checkComments = (films) => {
  return films.some(({comments}) => {
    return comments.length > 0;
  });
};

const createMostCommentedFilms = (films) => {
  return checkComments(films) ?
    `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container"></div>
  </section>`
    : `<section class="films-list films-list--extra"></section>`;
};

export default class MostCommentedFilms {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createMostCommentedFilms(this._films);
  }

  getElement() {
    this._element = this._element ? this._element : createElement(this.getTemplate());
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
