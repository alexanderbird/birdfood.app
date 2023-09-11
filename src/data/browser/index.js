
export class BrowserStorageData {
  constructor(localStorage) {
    this._localStorage = localStorage;
  }

  updateItem({ Id, ...attributes }) {
    const current = JSON.parse(this._localStorage.getItem(Id));
    const next = { ...current, ...attributes };
    this._localStorage.setItem(Id, JSON.stringify(next));
    return Promise.resolve();
  }

  getItem(id) {
    return JSON.parse(this._localStorage.getItem(id));
  }

  batchGetItems(ids) {
    const idsSet = new Set(ids);
    const items = Array.from(idsSet)
      .map(id => JSON.parse(this._localStorage.getItem(id)));
    return Promise.resolve(items);
  }

  putItem(attributes) {
    const existing = this._localStorage.getItem(attributes.Id);
    if (existing) {
      this._localStorage.setItem(attributes.Id, JSON.stringify({ ...JSON.parse(existing), ...attributes }));
    } else {
      this._localStorage.setItem(attributes.Id, JSON.stringify(attributes));
    }
    return Promise.resolve();
    
  }

  createItem(attributes) {
    this._localStorage.setItem(attributes.Id, JSON.stringify(attributes));
    return Promise.resolve();
  }

  addItemValue(id, attribute, addend) {
    const item = JSON.parse(this._localStorage.getItem(id));
    const newValue = (item[attribute] || 0) + addend;
    const positiveNewValue = Math.max(0, newValue);
    item[attribute] = positiveNewValue;
    this._localStorage.setItem(id, JSON.stringify(item));
    return Promise.resolve();
  }

  batchUpdateItems(itemChanges) {
    itemChanges.forEach(itemChange => {
      const item = JSON.parse(this._localStorage.getItem(itemChange.id));
      itemChange.updates.forEach(update => {
        item[update.attributeName] = update.value;
      });
      this._localStorage.setItem(itemChange.id, JSON.stringify(item));
    });
    return Promise.resolve();
  }

  listItems(prefix) {
    const items = [];
    for (let i = 0; i < this._localStorage.length; i++){
      const item = this._tryRead(this._localStorage.key(i));
      if (item.Id?.startsWith(prefix)) {
        items.push(item);
      }
    }
    return Promise.resolve(items);
  }

  _tryRead(key) {
    const value = this._localStorage.getItem(key);
    if (!value) {
      return undefined;
    }
    try {
      return JSON.parse(value);
    } catch(e) {
      return false;
    }

  }

  listItemsBetween(startInclusive, endInclusive) {
    const items = [];
    for (let i = 0; i < this._localStorage.length; i++){
      const item = JSON.parse(this._localStorage.getItem(this._localStorage.key(i)));
      if (item.Id >= startInclusive && item.Id <= endInclusive) {
        items.push(item);
      }
    }
    return Promise.resolve(items);
  }
}
