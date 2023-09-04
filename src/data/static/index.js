import staticItems from './items.json';

export class StaticData {
  constructor() {
    this.items = staticItems;
  }

  createItem(attributes) {
    this.items.push(attributes);
  }

  addItemValue(id, attribute, addend) {
    const item = this.items.find(x => x.Id === id);
    item[attribute] += addend;
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
