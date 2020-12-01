import AbstractView from "./abstract";

const checkRating = (films) => {
  return films.some(({rating}) => {
    return rating > 0;
  });
};

const createTopRatedFilms = (films) => {
  return checkRating(films) ?
    `<section class="films-list films-list--extra">
<h2 class="films-list__title">Top rated</h2>
<div class="films-list__container"></div>
</section>`
    : `<section class="films-list films-list--extra"></section>`;
};

export default class TopRatedFilms extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createTopRatedFilms(this._films);
  }
}
