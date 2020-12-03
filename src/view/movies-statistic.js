import {getNumberFormat} from "../utils/common";
import AbstractView from "./abstract";


const createMoviesStatistic = (films) => {
  return `<p>${getNumberFormat(films.length)} movies inside</p>`;
};

export default class MoviesStatistic extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMoviesStatistic(this._films);
  }
}
