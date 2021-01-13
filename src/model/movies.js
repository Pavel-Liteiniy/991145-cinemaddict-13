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

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._getMovieCount();
    this._notify(updateType);
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
      this._movieCountInCollection.watchlist = updatedMovie.inWatchListCollection ? ++this._movieCountInCollection.watchlist : --this._movieCountInCollection.watchlist;
    }

    if (prevMovie.inWatchedCollection !== updatedMovie.inWatchedCollection) {
      this._movieCountInCollection.history = updatedMovie.inWatchedCollection ? ++this._movieCountInCollection.history : --this._movieCountInCollection.history;
    }

    if (prevMovie.inFavoriteCollection !== updatedMovie.inFavoriteCollection) {
      this._movieCountInCollection.favorites = updatedMovie.inFavoriteCollection ? ++this._movieCountInCollection.favorites : --this._movieCountInCollection.favorites;
    }

    this._movies = updateItem(this._movies, updatedMovie, index);
    this._notify(updateType, updatedMovie);
  }

  _getMovieCount() {
    this._movies.forEach((movie) => {
      this._movieCountInCollection.watchlist = movie.inWatchListCollection ? ++this._movieCountInCollection.watchlist : this._movieCountInCollection.watchlist;
      this._movieCountInCollection.history = movie.inWatchedCollection ? ++this._movieCountInCollection.history : this._movieCountInCollection.history;
      this._movieCountInCollection.favorites = movie.inFavoriteCollection ? ++this._movieCountInCollection.favorites : this._movieCountInCollection.favorites;
    });
  }

  static adaptMovieToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        title: movie.film_info.title,
        genre: movie.film_info.genre,
        poster: movie.film_info.poster,
        description: movie.film_info.description,
        date: movie.film_info.release.date,
        country: movie.film_info.release.release_country,
        viewDate: movie.film_info.watching_date,
        duration: movie.film_info.runtime,
        rating: movie.film_info.total_rating,
        inWatchListCollection: movie.user_details.watchlist,
        inWatchedCollection: movie.user_details.already_watched,
        inFavoriteCollection: movie.user_details.favorite,
        alternativeTitle: movie.film_info.alternative_title,
        ageRating: movie.film_info.age_rating,
        director: movie.film_info.director,
        writers: movie.film_info.writers,
        actors: movie.film_info.actors,
      }
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptMovieToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        comments: movie.comments.map((comment) => {
          return comment.id;
        }),
        film_info: {
          title: movie.title,
          alternative_title: movie.alternativeTitle,
          total_rating: movie.rating,
          poster: movie.poster,
          age_rating: movie.ageRating,
          director: movie.director,
          writers: movie.writers,
          actors: movie.actors,
          release: {
            date: movie.date,
            release_country: movie.country,
          },
          runtime: movie.duration,
          genre: movie.genre,
          description: movie.description,
        },
        user_details: {
          watchlist: movie.inWatchListCollection,
          already_watched: movie.inWatchedCollection,
          watching_date: movie.viewDate,
          favorite: movie.inFavoriteCollection,
        }
      }
    );

    delete movie.comments;
    delete movie.title;
    delete movie.alternativeTitle;
    delete movie.rating;
    delete movie.poster;
    delete movie.ageRating;
    delete movie.director;
    delete movie.writers;
    delete movie.actors;
    delete movie.date;
    delete movie.country;
    delete movie.duration;
    delete movie.genre;
    delete movie.description;
    delete movie.inWatchListCollection;
    delete movie.inWatchedCollection;
    delete movie.viewDate;
    delete movie.inFavoriteCollection;

    return adaptedMovie;
  }

  static adaptCommentToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        message: comment.comment,
        emoji: comment.emotion,
      }
    );

    delete comment.comment;
    delete comment.emotion;

    return adaptedComment;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        comment: comment.message,
        emotion: comment.emoji,
      }
    );

    delete comment.message;
    delete comment.emoji;

    return adaptedComment;
  }
}
