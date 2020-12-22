import {remove, render, replace} from "../utils/render";
import {UpdateType} from "../const";
import MenuView from "../view/menu";

export default class Menu {
  constructor(menuContainer, moviesModel, filterModel) {
    this._menuContainer = menuContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._menuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevMenuComponent = this._menuComponent;

    this._menuComponent = new MenuView();
    this._menuComponent.setMovieCountInCollection(this._moviesModel.getMovieCountInCollection());
    this._menuComponent.setActiveFilter(this._filterModel.getFilter());
    this._menuComponent.setClickFilterHandler(this._handleFilterChange);

    if (prevMenuComponent === null) {
      render(this._menuContainer, this._menuComponent);
      return;
    }

    if (this._menuContainer.contains(prevMenuComponent.getElement())) {
      replace(this._menuComponent, prevMenuComponent);
    }

    remove(prevMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterSelected) {
    if (this._filterModel.getFilter() !== filterSelected) {
      this._filterModel.setFilter(UpdateType.MAJOR, filterSelected);
    }
  }
}
