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

  async putItem(attributes) {
    const existing = await this.getItem(attributes.Id);
    if (existing) {
      return await this.updateItem(attributes);
    } 
    return await this.createItem(attributes);
    
  }

  createItem(attributes) {
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

