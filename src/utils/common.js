export const getRandomInteger = (max, min = 0) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const makeTitleCase = (title, minorWords = []) => {
  minorWords = minorWords.join(` `).toLowerCase().split(` `);
  return title.toLowerCase().split(` `).map((word, i) => {

    if (word !== `` && ((!minorWords.includes(word)) || i === 0)) {
      word = word[0].toUpperCase() + word.slice(1);
    }

    return word;
  }).join(` `);
};

export const getNumberFormat = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `);
};
