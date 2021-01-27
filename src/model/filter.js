import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._selectedFilter = FilterType.ALL;
  }

  set selected({updateType, filterSelected}) {
    this._selectedFilter = filterSelected;
    this._notify(updateType, filterSelected);
  }

  get selected() {
    return this._selectedFilter;
  }
}
