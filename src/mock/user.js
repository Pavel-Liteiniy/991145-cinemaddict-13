import {USER_RANK} from "./../const";
import {getRandomInteger} from "./../utils/common";
import {Film} from "./film";

const getRandomTitles = ({TITLES: titles}) => {
  const randomTitles = [];
  const titlesNumber = getRandomInteger(titles.length);

  for (let i = 0; i < titlesNumber; i++) {
    randomTitles.push(titles.splice(getRandomInteger(titles.length - 1), 1).toString());
  }

  return randomTitles;
};

const getRank = (watchedFilmsCount) => {
  let userRank = false;

  for (let [range, rank] of USER_RANK) {
    if (watchedFilmsCount >= range[0] && watchedFilmsCount <= range[1]) {
      userRank = rank;
      break;
    }
  }

  return userRank;
};

export const generateUser = () => {
  const HISTORY = getRandomTitles(Film);
  return {
    ALL_MOVIES: getRandomTitles(Film),
    WATCHLIST: getRandomTitles(Film),
    HISTORY,
    FAVORITES: getRandomTitles(Film),
    RANK: getRank(HISTORY.length)
  };
};
