import {remove, render, replace} from "../utils/render";
import {isOnline} from "../utils/common.js";
import {toast} from "../utils/toast/toast.js";
import {UserAction} from "../const";
import MovieCardView from "../view/film-card";

export default class Movie {
  constructor(movieContainer, popupComponent, handleFilmChange, api) {
    this._bodyElement = document.querySelector(`body`);
    this._movieCardComponent = null;

    this._movieContainer = movieContainer;
    this._popupComponent = popupComponent;
    this._handleFilmChange = handleFilmChange;
    this._api = api;

    this._movieCardClickHandler = this._movieCardClickHandler.bind(this);
    this._movieCardClickButtonHandler = this._movieCardClickButtonHandler.bind(this);
    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
    this._popupClickHandler = this._popupClickHandler.bind(this);
    this._popupClickButtonHandler = this._popupClickButtonHandler.bind(this);
    this._popupSubmitCommentHandler = this._popupSubmitCommentHandler.bind(this);
    this._popupClickDeleteCommentButtonHandler = this._popupClickDeleteCommentButtonHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevMovieCardComponent = this._movieCardComponent;

    this._movieCardComponent = new MovieCardView(this._film);
    this._movieCardComponent.setClickHandler(this._movieCardClickHandler);
    this._movieCardComponent.setClickButtonHandler(this._movieCardClickButtonHandler);

    if (prevMovieCardComponent === null) {
      render(this._movieContainer, this._movieCardComponent);
      return;
    }

    if (this._movieContainer.contains(prevMovieCardComponent.getElement())) {
      replace(this._movieCardComponent, prevMovieCardComponent);
    }

    remove(prevMovieCardComponent);

    if (this._popupComponent.film.id === this._film.id && this._bodyElement.contains(this._popupComponent.getElement())) {
      this._popupComponent.updateData(this._film);
    }
  }

  destroy() {
    remove(this._movieCardComponent);
  }

  _movieCardClickHandler() {
    if (this._popupComponent.film.id === this._film.id && this._bodyElement.contains(this._popupComponent.getElement())) {
      return;
    }

    if (Object.keys(this._popupComponent.film).length !== 0) {
      this._popupComponent.removeEscKeyDownHandler();
      this._popupComponent.resetEmojiSelected();
      remove(this._popupComponent);
      this._bodyElement.classList.remove(`hide-overflow`);
    }

    this._api.getComments(this._film)
      .then((comments) => {
        this._popupComponent.film = Object.assign({}, this._film, {comments});

        this._popupComponent.setClickHandler(this._popupClickHandler);
        this._popupComponent.setClickButtonHandler(this._popupClickButtonHandler);
        this._popupComponent.setClickDeleteCommentButtonHandler(this._popupClickDeleteCommentButtonHandler);

        render(this._bodyElement, this._popupComponent);
      })
      .catch(() => {
        this._popupComponent.film = Object.assign({}, this._film, {comments: []});

        this._popupComponent.setClickHandler(this._popupClickHandler);
        this._popupComponent.setClickButtonHandler(this._popupClickButtonHandler);
        this._popupComponent.setClickDeleteCommentButtonHandler(this._popupClickDeleteCommentButtonHandler);

        render(this._bodyElement, this._popupComponent);
      });

    this._popupComponent.setSubmitCommentHandler(this._popupSubmitCommentHandler);
    this._popupComponent.setEscKeyDownHandler(this._popupEscKeyDownHandler);

    this._bodyElement.classList.add(`hide-overflow`);
  }

  _movieCardClickButtonHandler(film) {
    this._handleFilmChange(UserAction.UPDATE_MOVIE, film);
  }

  _popupClickHandler() {
    this._popupComponent.removeEscKeyDownHandler();
    this._popupComponent.removeSubmitCommentHandler();
    remove(this._popupComponent);
    this._bodyElement.classList.remove(`hide-overflow`);
  }

  _popupClickButtonHandler(film) {
    this._handleFilmChange(UserAction.UPDATE_MOVIE, film);
  }

  _popupSubmitCommentHandler(film) {
    if (!isOnline()) {
      toast(`You can't add new comment offline`);
      this._popupComponent.enableSubmitting();
      return;
    }

    this._handleFilmChange(UserAction.ADD_COMMENT, film);
  }

  _popupClickDeleteCommentButtonHandler(film) {
    if (!isOnline()) {
      toast(`You can't add delete comment offline`);
      this._popupComponent.enableDeleting();
      return;
    }

    this._handleFilmChange(UserAction.DELETE_COMMENT, film);
  }

  _popupEscKeyDownHandler() {
    this._popupClickHandler();
  }
}
