import AbstractView from "./abstract";
import {getRank} from "../utils/common";

const createUserRank = (rank) => {
  return rank ?
    `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
    : ``;
};

export default class UserRank extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createUserRank(this.userRank);
  }

  setWatchedMoviesCount(watchedMoviesCount) {
    this.watchedMoviesCount = watchedMoviesCount;
    this._getRank();
  }

  _getRank() {
    this.userRank = getRank(this.watchedMoviesCount);
  }
}
