import MoviesModel from "../model/movies.js";
import {isOnline} from "../utils/common.js";

const getSyncedMovies = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, moviesStore, commentsStore) {
    this._api = api;
    this._moviesStore = moviesStore;
    this._commentsStore = commentsStore;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptMovieToServer));
          this._moviesStore.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._moviesStore.getItems());

    return Promise.resolve(storeMovies.map(MoviesModel.adaptMovieToClient));
  }

  getComments(movie) {
    if (isOnline()) {
      return this._api.getComments(movie)
        .then((comments) => {
          const items = createStoreStructure(comments.map(MoviesModel.adaptCommentToServer));
          this._commentsStore.setItem(movie.id, items);
          return comments;
        });
    }

    const storeComments = Object.values(this._commentsStore.getItems()[movie.id] || {});
    return Promise.resolve(storeComments.map(MoviesModel.adaptCommentToClient));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._moviesStore.setItem(updatedMovie.id, MoviesModel.adaptMovieToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._moviesStore.setItem(movie.id, MoviesModel.adaptMovieToServer(Object.assign({}, movie)));

    return Promise.resolve(movie);
  }

  addComment(comment) {
    if (isOnline()) {
      return this._api.addComment(comment)
        .then((newComment) => {
          this._commentsStore.setItem(newComment.id, MoviesModel.adaptCommentToServer(newComment));
          return newComment;
        });
    }

    return Promise.reject(new Error(`Add comment failed`));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => this._commentsStore.removeItem(comment.id));
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._moviesStore.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = getSyncedMovies(response.updated);

          const items = createStoreStructure([...updatedMovies]);

          this._moviesStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
