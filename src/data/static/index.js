import staticItems from './items.json';

export class EmptyStaticData {
  constructor(items) {
    this.items = items || [];
  }

  updateItem({ Id, ...attributes }) {
    Object.assign(
      this.items.find(x => x.Id === Id),
      attributes
    );
  }

  getItem(id) {
    return this.items.find(x => x.Id === id);
  }

  createItem(attributes) {
    this.items.push(attributes);
  }

  addItemValue(id, attribute, addend) {
    const item = this.items.find(x => x.Id === id);
    const newValue = (item[attribute] || 0) + addend;
    const positiveNewValue = Math.max(0, newValue);
    item[attribute] = positiveNewValue;
  }

  batchUpdateItems(itemChanges) {
    itemChanges.forEach(itemChange => {
      const item = this.items.find(x => x.Id === itemChange.id);
      itemChange.updates.forEach(update => {
        item[update.attributeName] = update.value;
      });
    });
  }

  listItems(prefix) {
    return this.items.filter(x => x.Id.startsWith(prefix));
  }
}

export class StaticData extends EmptyStaticData {
  constructor() {
    super(staticItems);
  }
}

