import AbstractView from "./abstract";

const createShowButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowButton extends AbstractView {
  constructor() {
    super();
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return createShowButton();
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener(`click`, this._buttonClickHandler);
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }
}
