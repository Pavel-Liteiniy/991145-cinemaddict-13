import {nanoid} from "nanoid";
import dayjs from "dayjs";
import {getRandomInteger, makeTitleCase} from "./../utils/common";
import {MINOR_TITLE_WORDS} from "./../const";

const DatesDraft = {
  YEAR: {
    FILM: [dayjs().year(), 1900],
    COMMENT: [dayjs().year(), 2018],
  },
  MONTH: [11, 0],
};

const Film = {
  TITLES: [`made for each other`, `popeye meets sinbad`, `sagebrush trail`, `santa claus conquers the martians`, `the dance of life`, `the great flamarion`, `the man with the golden arm`],
  POSTERS: [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`],
  DESCRIPTION: {
    TEXT: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
    REG_EXP: new RegExp(`[^\\s].*?\\.`, `gi`),
    LENGTH_MIN: 1,
    LENGTH_MAX: 5,
  },
  RATING: {
    MIN: 0,
    MAX: 100,
  }
};

const Comment = {
  MAX_COUNT: 5,
  MIN_COUNT: 0,
  MESSAGES: [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`, `Not so bad`],
  EMOJIS: [`smile`, `sleeping`, `puke`, `angry`],
  AUTHORS: [`John Doe`, `Doe John`, `John John`, `Doe Doe`, `John John Doe`],
  DATE: {
    YEAR: [dayjs().year(), 2019],
    MONTH: [11, 0],
  }
};

const generateTitle = ({TITLES: titles}) => {
  const generatedTitle = titles[getRandomInteger(titles.length - 1)].toLowerCase();
  return (makeTitleCase(generatedTitle, MINOR_TITLE_WORDS));
};

const generatePoster = (title, {POSTERS: posters}) => {
  let matchedPoster;

  for (let poster of posters) {
    if (poster.startsWith(title.toLowerCase().replaceAll(` `, `-`))) {
      matchedPoster = poster;
      break;
    }
  }

  return matchedPoster;
};

const generateDescription = ({
  DESCRIPTION: {
    TEXT: text,
    REG_EXP: regExp,
    LENGTH_MIN: min,
    LENGTH_MAX: max,
  },
}) => {
  const descriptionSentences = text.match(regExp) || [];
  const randomSentences = [];

  for (let i = 0; i < getRandomInteger(max, min); i++) {
    randomSentences.push(descriptionSentences.splice(getRandomInteger(descriptionSentences.length - 1), 1));
  }

  return randomSentences.join(` `);
};

const generateFilmDate = () => {
  const randomYear = getRandomInteger(...DatesDraft.YEAR.FILM);
  const randomMonth = getRandomInteger(...DatesDraft.MONTH);
  const randomDay = getRandomInteger(dayjs(randomMonth).daysInMonth(), 1);

  return dayjs(new Date(randomYear, randomMonth, randomDay));
};

const generateCommentDate = () => {
  const randomYear = getRandomInteger(...DatesDraft.YEAR.COMMENT);
  const randomMonth = getRandomInteger(...DatesDraft.MONTH);
  const randomDay = getRandomInteger(dayjs(randomMonth).daysInMonth(), 1);

  return dayjs(new Date(randomYear, randomMonth, randomDay));
};

const createComment = ({
  MESSAGES: messages,
  EMOJIS: emojis,
  AUTHORS: authors,
}) => {
  return {
    message: messages[getRandomInteger(messages.length - 1)],
    emoji: emojis[getRandomInteger(emojis.length - 1)],
    author: authors[getRandomInteger(authors.length - 1)],
    date: generateCommentDate(),
  };
};

const generateComments = ({MAX_COUNT: maxCount, MIN_COUNT: minCount}) => {
  return new Array(getRandomInteger(maxCount, minCount)).fill().map(createComment.bind(null, Comment));
};

export const generateFilm = () => {
  const title = generateTitle(Film);

  return {
    id: nanoid(),
    title,
    poster: generatePoster(title, Film),
    description: generateDescription(Film),
    date: generateFilmDate(),
    duration: getRandomInteger(190, 3),
    comments: generateComments(Comment),
    rating: getRandomInteger(Film.RATING.MAX),
    inWatchListCollection: !!getRandomInteger(1),
    inWatchedCollection: !!getRandomInteger(1),
    inFavoriteCollection: !!getRandomInteger(1),
  };
};

export {Film};
