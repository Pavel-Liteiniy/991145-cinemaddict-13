import AbstractView from "./abstract";

const createFilmsWrapper = () => {
  return `<section class="films"></section>`;
};

export default class FilmsWrapper extends AbstractView {
  getTemplate() {
    return createFilmsWrapper();
  }
}
