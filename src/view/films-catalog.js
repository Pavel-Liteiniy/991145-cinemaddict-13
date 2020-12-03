import AbstractView from "./abstract";

const createFilmsCatalog = (films) => {
  return films.length > 0 ?
    `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
    </section>`
    : `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
    <div class="films-list__container"></div>
    </section>`;
};

export default class FilmsCatalog extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmsCatalog(this._films);
  }
}
