import staticItems from './items.json';

export class StaticData {
  constructor() {
    this.items = staticItems;
  }

  updateItem({ Id, ...attributes }) {
    Object.assign(
      this.items.find(x => x.Id === Id),
      attributes
    );
  }

  createItem(attributes) {
    this.items.push(attributes);
  }

  addItemValue(id, attribute, addend) {
    const item = this.items.find(x => x.Id === id);
    item[attribute] = (item[attribute] || 0) + addend;
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
