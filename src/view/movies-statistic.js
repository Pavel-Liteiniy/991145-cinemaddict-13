import {createElement, getNumberFormat} from "../utils";

const createMoviesStatistic = (films) => {
  return `<p>${getNumberFormat(films.length)} movies inside</p>`;
};

export default class MoviesStatistic {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createMoviesStatistic(this._films);
  }

  getElement() {
    this._element = this._element ? this._element : createElement(this.getTemplate());
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
