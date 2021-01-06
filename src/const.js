export const MINOR_TITLE_WORDS = [`a`, `an`, `the`, `and`, `as`, `but`, `for`, `if`, `nor`, `or`, `so`, `yet`, `as`, `at`, `by`, `for`, `in`, `of`, `off`, `on`, `per`, `to`, `up`, `via`, `with`];

export const USER_RANK = new Map([
  [[0, 0], false],
  [[1, 10], `novice`],
  [[11, 20], `fan`],
  [[21, Infinity], `movie buff`],
]);

export const FilmsCollection = {
  WATCH_LIST: `add-to-watchlist`,
  WATCHED: `mark-as-watched`,
  FAVORITE: `mark-as-favorite`,
};

export const SortType = {
  BY_DEFAULT: `default`,
  BY_DATE: `date`,
  BY_RATING: `rating`
};

export const UserAction = {
  UPDATE_MOVIE: `UPDATE_MOVIE`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  STATS: `STATS`,
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  DISABLED: ``,
};

export const TimeRange = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};
