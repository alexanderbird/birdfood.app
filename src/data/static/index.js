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
    return Promise.resolve();
  }

  getItem(id) {
    return Promise.resolve(this.items.find(x => x.Id === id));
  }

  batchGetItems(ids) {
    const idsSet = new Set(ids);
    return Promise.resolve(this.items.filter(x => idsSet.has(x.Id)));
  }

  createOrUpdateItem(attributes) {
    const existing = this.items.find(x => x.Id === attributes.Id);
    if (existing) {
      Object.assign(existing, attributes);
    } else {
      this.items.push(attributes);
    }
    return Promise.resolve();
    
  }

  createItem(attributes) {
    // disable the existence check if there are many items
    // this is a dev/test/demo implementation so we don't have a data corruption
    // risk
    const existing = this.items.length < 400 && this.items.find(x => x.Id === attributes.Id);
    if (existing) {
      return Promise.reject(`There is already an item with Id=${attributes.Id}`);
    }
    this.items.push(attributes);
    return Promise.resolve();
  }

  addItemValue(id, attribute, addend) {
    const item = this.items.find(x => x.Id === id);
    const newValue = (item[attribute] || 0) + addend;
    const positiveNewValue = Math.max(0, newValue);
    item[attribute] = positiveNewValue;
    return Promise.resolve();
  }

  batchUpdateItems(itemChanges) {
    itemChanges.forEach(itemChange => {
      const item = this.items.find(x => x.Id === itemChange.id);
      itemChange.updates.forEach(update => {
        item[update.attributeName] = update.value;
      });
    });
    return Promise.resolve();
  }

  listItems(prefix) {
    return Promise.resolve(this.items.filter(x => x.Id.startsWith(prefix)));
  }

  listItemsBetween(startInclusive, endInclusive) {
    return this.items
      .filter(x => x.Id >= startInclusive && x.Id <= endInclusive);
  }
}

export class StaticData extends EmptyStaticData {
  constructor() {
    super(staticItems);
  }
}
