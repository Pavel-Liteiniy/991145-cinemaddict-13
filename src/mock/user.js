import {getRandomInteger, getRank} from "./../utils/common";
import {Film} from "./film";

const getRandomTitles = ({TITLES: titles}) => {
  const randomTitles = [];
  const titlesNumber = getRandomInteger(titles.length);

  for (let i = 0; i < titlesNumber; i++) {
    randomTitles.push(titles.splice(getRandomInteger(titles.length - 1), 1).toString());
  }

  return randomTitles;
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
