import {createElement} from "../utils";

const createShowButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowButton();
  }

  getElement() {
    this._element = this._element ? this._element : createElement(this.getTemplate());
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
