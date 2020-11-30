import {createElement} from "../utils";

const createFilmsWrapper = () => {
  return `<section class="films"></section>`;
};

export default class FilmsWrapper {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsWrapper();
  }

  getElement() {
    this._element = this._element ? this._element : createElement(this.getTemplate());
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
