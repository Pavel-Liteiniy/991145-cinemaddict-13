import AbstractView from "./abstract";

const createUserRank = ({RANK: rank}) => {
  return rank ?
    `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
    : ``;
};

export default class UserRank extends AbstractView {
  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return createUserRank(this._user);
  }
}
