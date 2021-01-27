import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import dayOfYear from "dayjs/plugin/dayOfYear";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart.js";
import {TimeRange} from "../const";
import {getRank} from "../utils/common";

dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);

const BAR_HEIGHT = 50;

const createStatistic = ({userRank, topGenre, watchedMoviesCount, moviesDuration, timeRangeSelected = TimeRange.ALL_TIME}) => {
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRank || ``}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time"${timeRangeSelected === TimeRange.ALL_TIME ? ` checked` : ``}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today"${timeRangeSelected === TimeRange.TODAY ? ` checked` : ``}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week"${timeRangeSelected === TimeRange.WEEK ? ` checked` : ``}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month"${timeRangeSelected === TimeRange.MONTH ? ` checked` : ``}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year"${timeRangeSelected === TimeRange.YEAR ? ` checked` : ``}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedMoviesCount} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${dayjs.duration(moviesDuration, `minutes`).hours()} <span class="statistic__item-description">h</span> ${dayjs.duration(moviesDuration, `minutes`).minutes()} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
  </section>`;
};

export default class Statistic extends SmartView {
  constructor() {
    super();
    this._data.timeRangeSelected = TimeRange.ALL_TIME;

    this._statisticPeriodClickHandler = this._statisticPeriodClickHandler.bind(this);
  }

  set films(films) {
    this.updateData({films}, true);
    this._getStatistic();
    this._getRank();
    this._setInnerHandlers();
    this._setChart();
  }

  get films() {
    return this._data.films.slice().filter((film) => {
      if (film.inWatchedCollection) {
        if (this._data.timeRangeSelected === TimeRange.ALL_TIME) {
          return true;
        }

        if (this._data.timeRangeSelected === TimeRange.YEAR) {
          return dayjs().year() === dayjs(film.viewDate).year();
        }

        if (this._data.timeRangeSelected === TimeRange.MONTH) {
          return dayjs().year() === dayjs(film.viewDate).year() && dayjs().month() === dayjs(film.viewDate).month();
        }

        if (this._data.timeRangeSelected === TimeRange.WEEK) {
          return dayjs().year() === dayjs(film.viewDate).year() && dayjs().week() === dayjs(film.viewDate).week();
        }

        if (this._data.timeRangeSelected === TimeRange.TODAY) {
          return dayjs().year() === dayjs(film.viewDate).year() && dayjs().dayOfYear() === dayjs(film.viewDate).dayOfYear();
        }
      }

      return false;
    });
  }

  getTemplate() {
    return createStatistic(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _getStatistic() {
    const statistic = {
      watchedMoviesCount: 0,
      moviesDuration: 0,
      genre: {},
    };

    this.films.map((film) => {
      statistic.moviesDuration += film.duration;
      statistic.watchedMoviesCount += 1;

      film.genre.forEach((genre) => {
        if (genre in statistic.genre) {
          statistic.genre[genre] += 1;
        } else {
          statistic.genre[genre] = 1;
        }
      });
    });

    const watchedGenres = Object.keys(statistic.genre);
    let topGenreCount = 0;
    let topGenre = ``;
    Object.values(statistic.genre).forEach((movieCount, index) => {
      if (movieCount > topGenreCount) {
        topGenreCount = movieCount;
        topGenre = watchedGenres[index];
      }
    });

    this.updateData(statistic, true);
    this.updateData({topGenre}, true);
  }

  _getRank() {
    const userRank = getRank(this._data.watchedMoviesCount);
    this.updateData({userRank}, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._statisticPeriodClickHandler);
  }

  _statisticPeriodClickHandler(evt) {
    if (evt.target.classList.contains(`statistic__filters-input`)) {
      this.updateData({timeRangeSelected: evt.target.value}, true);
      this._getStatistic();
      this.updateElement();
      this._setChart();
    }
  }

  _setChart() {
    const labels = Object.keys(this._data.genre);
    const labelsCount = Object.values(this._data.genre);
    const statisticCtxElement = this.getElement().querySelector(`.statistic__chart`);

    statisticCtxElement.height = BAR_HEIGHT * labels.length;

    this._chart = new Chart(statisticCtxElement, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data: labelsCount,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }
}
