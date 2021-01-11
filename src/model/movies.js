import Observer from "../utils/observer.js";
import {updateItem} from '../utils/common';

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
    this._movieCountInCollection = {
      watchlist: 0,
      history: 0,
      favorites: 0,
    };
  }

  setMovies(movies) {
    this._movies = movies.slice();
    this._getMovieCount();
  }

  getMovies() {
    return this._movies;
  }

  getMovieCountInCollection() {
    return this._movieCountInCollection;
  }

  updateMovie(updateType, updatedMovie) {
    const index = this._movies.findIndex((movie) => movie.id === updatedMovie.id);
    const prevMovie = this._movies[index];

    if (prevMovie.inWatchListCollection !== updatedMovie.inWatchListCollection) {
      this._movieCountInCollection.watchlist = updatedMovie.inWatchListCollection ? this._movieCountInCollection.watchlist += 1 : this._movieCountInCollection.watchlist -= 1;
    }

    if (prevMovie.inWatchedCollection !== updatedMovie.inWatchedCollection) {
      this._movieCountInCollection.history = updatedMovie.inWatchedCollection ? this._movieCountInCollection.history += 1 : this._movieCountInCollection.history -= 1;
    }

    if (prevMovie.inFavoriteCollection !== updatedMovie.inFavoriteCollection) {
      this._movieCountInCollection.favorites = updatedMovie.inFavoriteCollection ? this._movieCountInCollection.favorites += 1 : this._movieCountInCollection.favorites -= 1;
    }

    this._movies = updateItem(this._movies, updatedMovie, index);
    this._notify(updateType, updatedMovie);
  }

  _getMovieCount() {
    this._movies.forEach((movie) => {
      this._movieCountInCollection.watchlist = movie.inWatchListCollection ? this._movieCountInCollection.watchlist += 1 : this._movieCountInCollection.watchlist;
      this._movieCountInCollection.history = movie.inWatchedCollection ? this._movieCountInCollection.history += 1 : this._movieCountInCollection.history;
      this._movieCountInCollection.favorites = movie.inFavoriteCollection ? this._movieCountInCollection.favorites += 1 : this._movieCountInCollection.favorites;
    });
  }
}
