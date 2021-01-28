import {USER_RANK} from "../const";

export const getNumberFormat = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `);
};

export const updateItem = (items, update, index) => {
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const getRank = (watchedFilmsCount) => {
  let userRank = false;

  for (const [range, rank] of USER_RANK) {
    if (watchedFilmsCount >= range[0] && watchedFilmsCount <= range[1]) {
      userRank = rank;
      break;
    }
  }

  return userRank;
};

export const isOnline = () => {
  return window.navigator.onLine;
};
