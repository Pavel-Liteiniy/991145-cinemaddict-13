import Observer from "../utils/observer.js";
import {updateItem} from '../utils/common';

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, updatedMovie) {
    updateItem(this._movies, updatedMovie);
    this._notify(updateType, updatedMovie);
  }
}
