import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SmartView from "./smart";
import {FilmsCollection} from "../const";

dayjs.extend(relativeTime);

const KEY_ESCAPE = `Escape`;
const KEY_ESC = `Esc`;

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
      <p class="film-details__comment-text">${message}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`);
  }

  return commentsList;
};

const createEmojiImage = ({VALUE: value, URL: url, ALT: alt}) => {
  return value ? `<img src="${url}" width="50" height="50" alt="${alt}">` : ``;
};

const createPopup = ({title, poster, description, date, comments, rating, inWatchListCollection, inWatchedCollection, inFavoriteCollection, emojiSelected = {}}) => {
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="${title}">
          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: The Great Flamarion</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${Math.trunc(rating / 10)}.${rating % 10}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">Anthony Mann</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format(`D MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">1h 18m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">USA</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">Drama</span>
                <span class="film-details__genre">Film-Noir</span>
                <span class="film-details__genre">Mystery</span></td>
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
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
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

    this._clickHandler = this._clickHandler.bind(this);
    this._clickButtonHandler = this._clickButtonHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._changeEmojiHandler = this._changeEmojiHandler.bind(this);
  }

  setFilm(film) {
    this._data = film;
    this._setInnerHandlers();
  }

  getFilm() {
    return this._data;
  }

  getTemplate() {
    return createPopup(this._data);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickButtonHandler(callback) {
    this._callback.clickButton = callback;

    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, this._clickButtonHandler);
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

  setEscKeyDownHandler(callback) {
    this._callback.escKeyDown = callback;

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  removeEscKeyDownHandler() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KEY_ESCAPE || evt.key === KEY_ESC) {
      evt.preventDefault();
      this._callback.escKeyDown();
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setClickHandler(this._callback.click);
    this.setClickButtonHandler(this._callback.clickButton);
    this.setEscKeyDownHandler(this._callback.escKeyDown);
  }

  _setInnerHandlers() {
    if (Object.keys(this._data).length !== 0) {
      this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._changeEmojiHandler);
    }
  }

  _changeEmojiHandler(evt) {
    if (evt.target.classList.contains(`film-details__emoji-item`)) {

      if (`emojiSelected` in this._data) {
        if (this._data.emojiSelected.VALUE === evt.target.value) {
          return;
        }
      }

      const PopupscrollTop = this.getElement().scrollTop;

      switch (evt.target.value) {
        case Emoji.SMILE.VALUE:
          this.updateData({emojiSelected: Emoji.SMILE});
          break;
        case Emoji.SLEEPING.VALUE:
          this.updateData({emojiSelected: Emoji.SLEEPING});
          break;
        case Emoji.PUKE.VALUE:
          this.updateData({emojiSelected: Emoji.PUKE});
          break;
        case Emoji.ANGRY.VALUE:
          this.updateData({emojiSelected: Emoji.ANGRY});
          break;
      }

      this.getElement().scrollTop = PopupscrollTop;
    }
  }
}
