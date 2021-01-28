import {getNumberFormat} from "../utils/common";
import AbstractView from "./abstract";


const createMoviesSummary = (films) => {
  return `<p>${getNumberFormat(films.length)} movies inside</p>`;
};

export default class MoviesSummary extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMoviesSummary(this._films);
  }
}
