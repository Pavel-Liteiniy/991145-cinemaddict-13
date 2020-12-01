import AbstractView from "./abstract";

const createShowButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowButton extends AbstractView {
  getTemplate() {
    return createShowButton();
  }
}
