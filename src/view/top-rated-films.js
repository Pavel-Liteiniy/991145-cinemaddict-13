const checkRating = (films) => {
  return films.some(({rating}) => {
    return rating > 0;
  });
};

export const createTopRatedFilms = (films, cards) => {
  return checkRating(films) ?
    `<section class="films-list films-list--extra">
<h2 class="films-list__title">Top rated</h2>
<div class="films-list__container">${cards.join(``)}</div>
</section>`
    : `<section class="films-list films-list--extra"></section>`;
};
