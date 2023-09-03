import staticItems from './items.json';

export class StaticData {
  constructor() {
    this.items = staticItems;
  }

  listItems() {
    return this.items;
  }
}
