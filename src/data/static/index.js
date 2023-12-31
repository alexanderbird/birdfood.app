import staticItems from './items.json';
import { correctValueTypesFor } from '../schema';

export class EmptyStaticData {
  constructor(items) {
    this.items = items || [];
  }

  updateItem({ Id, ...attributes }) {
    const existing = this.items.find(x => x.Id === Id);
    if (!existing) {
      return Promise.reject(`No such item ${Id}`);
    }
    Object.assign(
      existing,
      correctValueTypesFor(attributes)
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
      Object.assign(existing, correctValueTypesFor(attributes));
    } else {
      this.items.push(correctValueTypesFor(attributes));
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
    this.items.push(correctValueTypesFor(attributes));
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
      if (!item) {
        throw new Error(`Cannot update item ${itemChange.id} because it does not exist`);
      }
      itemChange.updates.forEach(update => {
        item[update.attributeName] = update.value;
      });
    });
    return Promise.resolve();
  }

  listItems(prefix) {
    return Promise.resolve(this.items.filter(x => x.Id.startsWith(prefix)));
  }

  listPurchaseHistoryItems(prefix) {
    return Promise.resolve(this.items.filter(x => x.PurchaseHistoryId?.startsWith(prefix)));
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
