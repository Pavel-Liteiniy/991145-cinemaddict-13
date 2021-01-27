import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import durationDayjs from "dayjs/plugin/duration";
import he from "he";
import SmartView from "./smart";
import {FilmsCollection} from "../const";

dayjs.extend(relativeTime);
dayjs.extend(durationDayjs);

const KeyName = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
  ENTER: `Enter`,
};

const Emoji = {
  SMILE: {
    VALUE: `smile`,
    URL: `./images/emoji/smile.png`,
    ALT: `emoji-smile`,
  },
  SLEEPING: {
    VALUE: `sleeping`,
    URL: `./images/emoji/sleeping.png`,
    ALT: `emoji-sleeping`,
  },
  PUKE: {
    VALUE: `puke`,
    URL: `./images/emoji/puke.png`,
    ALT: `emoji-puke`,
  },
  ANGRY: {
    VALUE: `angry`,
    URL: `./images/emoji/angry.png`,
    ALT: `emoji-angry`,
  },
};

const createComments = (comments) => {
  let commentsList = [];

  for (let {message, emoji, author, date} of comments) {
    commentsList.push(`<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(message)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
        <button class="film-details__comment-delete" data-author="${author}">Delete</button>
      </p>
    </div>
  </li>`);
  }

  return commentsList;
};

const createGenres = (genres) => {
  let genresList = [];

  genresList = genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  });

  return genresList;
};

const createEmojiImage = ({VALUE: value = ``, URL: url = ``, ALT: alt = ``}) => {
  return value ? `<img src="${url}" width="50" height="50" alt="${alt}">` : ``;
};

const createPopup = ({title, genre, poster, description, date, country, duration, comments, rating, inWatchListCollection, inWatchedCollection, inFavoriteCollection, alternativeTitle, ageRating, director, writers, actors}, emojiSelected = {}) => {
  const durationHours = dayjs.duration(duration, `minutes`).hours();
  const durationMinutes = dayjs.duration(duration, `minutes`).minutes();

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="${title}">
          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format(`D MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${durationHours ? durationHours + `h ` : ``}${durationMinutes}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${createGenres(genre).join(``)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"${inWatchListCollection ? ` checked` : ``} data-films-collection="add-to-watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"${inWatchedCollection ? ` checked` : ``} data-films-collection="mark-as-watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"${inFavoriteCollection ? ` checked` : ``} data-films-collection="mark-as-favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">${createComments(comments).join(``)}</ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${createEmojiImage(emojiSelected)}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"${emojiSelected.VALUE === Emoji.SMILE.VALUE ? ` checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"${emojiSelected.VALUE === Emoji.SLEEPING.VALUE ? ` checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"${emojiSelected.VALUE === Emoji.PUKE.VALUE ? ` checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"${emojiSelected.VALUE === Emoji.ANGRY.VALUE ? ` checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor() {
    super();
    this._emojiSelected = {};

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._clickButtonHandler = this._clickButtonHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._clickDeleteCommentButtonHandler = this._clickDeleteCommentButtonHandler.bind(this);
    this._submitCommentHandler = this._submitCommentHandler.bind(this);
  }

  set film(film) {
    this._data = film;
    this._setInnerHandlers();
  }

  get film() {
    return this._data;
  }

  updateElement() {
    let prevElement = this.getElement();
    this._scrollTop = prevElement.scrollTop;
    const parentElement = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parentElement.replaceChild(newElement, prevElement);

    this.restoreHandlers();
    this.updateScrollTop();
  }

  getTemplate() {
    return createPopup(this._data, this._emojiSelected);
  }

  updateScrollTop() {
    this.getElement().scrollTop = this._scrollTop;
  }

  setCloseButtonClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  setClickDeleteCommentButtonHandler(callback) {
    this._callback.clickDeleteCommentButton = callback;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._clickDeleteCommentButtonHandler);
  }

  setClickButtonHandler(callback) {
    this._callback.clickButton = callback;

    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, this._clickButtonHandler);
  }

  setEscKeyDownHandler(callback) {
    this._callback.escKeyDown = callback;

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  removeEscKeyDownHandler() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setCommentSubmitHandler(callback) {
    this._callback.submitComment = callback;
    document.addEventListener(`keydown`, this._submitCommentHandler);
  }

  removeCommentSubmitHandler() {
    document.removeEventListener(`keydown`, this._submitCommentHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCloseButtonClickHandler(this._callback.click);
    this.setClickDeleteCommentButtonHandler(this._callback.clickDeleteCommentButton);
    this.setCommentSubmitHandler(this._callback.submitComment);
    this.setClickButtonHandler(this._callback.clickButton);
    this.setEscKeyDownHandler(this._callback.escKeyDown);
  }

  enableSubmitting() {
    this._messageElement.disabled = false;

    Array.from(this._emojiElements).forEach((emojiButton) => {
      emojiButton.disabled = false;
    });
  }

  enableDeleting() {
    this._deletinigCommentButtonElement.disabled = false;
    this._deletinigCommentButtonElement.textContent = `Delete`;
  }

  resetEmojiSelected() {
    this._emojiSelected = {};
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this.resetEmojiSelected();
    this._callback.click();
  }

  _clickDeleteCommentButtonHandler(evt) {
    if (evt.target.classList.contains(`film-details__comment-delete`)) {
      evt.preventDefault();
      this._deletinigCommentButtonElement = evt.target;
      this._deletinigCommentButtonElement.disabled = true;
      this._deletinigCommentButtonElement.textContent = `Deleting...`;

      const commentIndex = this._data.comments.findIndex((comment) => {
        return comment.author === this._deletinigCommentButtonElement.dataset.author;
      });

      this._scrollTop = this.getElement().scrollTop;
      this._callback.clickDeleteCommentButton({movie: this._data, deletedComment: this._data.comments[commentIndex], deletedCommentIndex: commentIndex});
    }
  }

  _clickButtonHandler(evt) {
    if (evt.target.classList.contains(`film-details__control-input`)) {
      evt.preventDefault();

      switch (evt.target.dataset.filmsCollection) {
        case FilmsCollection.WATCH_LIST:
          this._data.inWatchListCollection = !this._data.inWatchListCollection;
          break;
        case FilmsCollection.WATCHED:
          this._data.inWatchedCollection = !this._data.inWatchedCollection;
          break;
        case FilmsCollection.FAVORITE:
          this._data.inFavoriteCollection = !this._data.inFavoriteCollection;
          break;
      }

      this._callback.clickButton(this._data);
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KeyName.ESCAPE || evt.key === KeyName.ESC) {
      evt.preventDefault();
      this.resetEmojiSelected();
      this._callback.escKeyDown();
    }
  }

  _submitCommentHandler(evt) {
    this._messageElement = this.getElement().querySelector(`.film-details__comment-input`);

    const message = this._messageElement.value;
    const emoji = this._emojiSelected.VALUE;

    this._emojiElements = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    if (evt.ctrlKey && evt.key === KeyName.ENTER && message && this._isEmojiChecked()) {
      evt.preventDefault();

      this._messageElement.disabled = true;
      Array.from(this._emojiElements).forEach((emojiButton) => {
        emojiButton.disabled = true;
      });

      this._scrollTop = this.getElement().scrollTop;
      this.resetEmojiSelected();
      this._callback.submitComment({movie: this._data, newComment: {message, emoji, date: dayjs()}});
    }
  }

  _setInnerHandlers() {
    if (Object.keys(this._data).length !== 0) {
      this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
    }
  }

  _isEmojiChecked() {
    let isChecked = false;

    Array.from(this._emojiElements).some((emojiButton) => {
      if (emojiButton.checked) {
        isChecked = true;
      }

      return isChecked;
    });

    return isChecked;
  }

  _emojiChangeHandler(evt) {
    if (evt.target.classList.contains(`film-details__emoji-item`)) {

      if (this.emojiSelected === evt.target.value) {
        return;
      }

      this._scrollTop = this.getElement().scrollTop;

      switch (evt.target.value) {
        case Emoji.SMILE.VALUE:
          this._emojiSelected = Emoji.SMILE;
          break;
        case Emoji.SLEEPING.VALUE:
          this._emojiSelected = Emoji.SLEEPING;
          break;
        case Emoji.PUKE.VALUE:
          this._emojiSelected = Emoji.PUKE;
          break;
        case Emoji.ANGRY.VALUE:
          this._emojiSelected = Emoji.ANGRY;
          break;
      }

      const messageElement = this.getElement().querySelector(`.film-details__comment-input`).value;
      this.updateElement();
      this.getElement().querySelector(`.film-details__comment-input`).value = messageElement;
      this.updateScrollTop();
    }
  }

}
