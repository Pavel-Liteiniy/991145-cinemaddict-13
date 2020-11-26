const getNumberFormat = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `);
};

export const createMoviesStatistic = (films) => {
  return `<p>${getNumberFormat(films.length)} movies inside</p>`;
};
