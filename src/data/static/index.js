import staticItems from './items.json';

export class StaticData {
  constructor() {
    this.items = staticItems;
  }

  batchUpdateItems(itemChanges) {
    itemChanges.forEach(itemChange => {
      const item = this.items.find(x => x.Id === itemChange.id);
      itemChange.updates.forEach(update => {
        item[update.attributeName] = update.value;
      });
    });
  }

  listItems() {
    return this.items;
  }
}
