import AbstractView from "./abstract";

const createFilmsCatalog = (isLoading, films) => {
  if (isLoading) {
    return `<section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
      </section>`;
  }

  return `<section class="films-list">
    ${films.length > 0 ?
    `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`
    : `<h2 class="films-list__title">There are no movies in our database</h2>`}
    <div class="films-list__container"></div>
    </section>`;
};

export default class FilmsCatalog extends AbstractView {
  constructor() {
    super();
    this._films = null;
    this._isLoading = false;
  }

  getTemplate() {
    return createFilmsCatalog(this._isLoading, this._films);
  }

  setFilms(films) {
    this._films = films;
  }

  setLoadingStatus(status) {
    this._isLoading = status;
  }
}
