const checkComments = (films) => {
  return films.some(({comments}) => {
    return comments.length > 0;
  });
};

export const createMostCommentedFilms = (films, cards) => {
  return checkComments(films) ?
    `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container">${cards.join(``)}</div>
</section>`
    : `<section class="films-list films-list--extra"></section>`;
};
