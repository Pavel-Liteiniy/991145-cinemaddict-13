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
    this._menuComponent.setActiveFilter(this._filterModel.selected);
    this._menuComponent.setClickMenuHandler(this._handleFilterChange);

    if (prevMenuComponent === null) {
      render(this._menuContainer, this._menuComponent);
      return;
    }

    if (this._menuContainer.contains(prevMenuComponent.getElement())) {
      replace(this._menuComponent, prevMenuComponent);
    }

    remove(prevMenuComponent);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MAJOR:
      case UpdateType.MINOR:
      case UpdateType.STATS:
        this.init();
        break;
    }
  }

  _handleFilterChange(filterSelected) {
    if (this._filterModel.selected !== filterSelected) {
      this._filterModel.selected = {updateType: UpdateType.MAJOR, filterSelected};
    }
  }
}
