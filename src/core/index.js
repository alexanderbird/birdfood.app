import { Chronometer } from './Chronometer';

export class Core {
  constructor(data, chronometer) {
    this.chronometer = chronometer || new Chronometer();
    this.data = data;
    this.shoppingListConsumers = {};
  }

  startShopping() {
    return {
      Id: this._generateId("s-"),
    };
  }

  stopShopping(id) {
    throw new Error(`Cannot stop Shopping Event ${id}`);
  }

  offShoppingListUpdate(key) {
    delete this.shoppingListConsumers[key];
  }

  onShoppingListUpdate(key, consumeShoppingList) {
    this.shoppingListConsumers[key] = { key, consumeShoppingList };
  }

  addRecurringItems() {
    const toAdd = this.getShoppingList().recurringItemsToAdd;
    this.data.batchUpdateItems(toAdd.map(item => ({
      id: item.Id,
      updates: [
        {
          value: this._getCurrentTimestamp(),
          attributeName: 'LastUpdated',
        },
        {
          value: Math.max(item.PlannedQuantity, item.RecurringQuantity),
          attributeName: "PlannedQuantity"
        }
      ]
    })));
    return toAdd.map(x => x.Id);
  }

  addToItemPlannedQuantity(id, addend) {
    this.data.addItemValue(id, "PlannedQuantity", addend);
  }

  addToItemRecurringQuantity(id, addend) {
    this.data.addItemValue(id, "RecurringQuantity", addend);
  }

  removeItemsFromShoppingList(itemIds) {
    this.data.batchUpdateItems(itemIds.map(id => ({
      id,
      updates: [{
        value: 0,
        attributeName: "PlannedQuantity"
      }]
    })));
  }

  getItem(id) {
    return this._supplyMissingFields(this.data.getItem(id));
  }

  updateItem(attributes) {
    this.data.updateItem(attributes);
  }

  createItem(attributes) {
    if (!attributes.Name) {
      throw new Error("Name is required.");
    }
    const item = {
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
      Id: this._generateId("i-"),
    };
    this.data.createItem(item);
    return this._supplyMissingFields(item);
  }

  updateItemAndTimestamp(attributes) {
    this.data.updateItem({
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
    });
  }

  getShoppingList() {
    const all = [];
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    const recurringItemsToAdd = [];
    const recurringItems = [];
    this.data.listItems().map(item => this._supplyMissingFields(item)).forEach(item => {
      all.push(item);
      if (item.RecurringQuantity) {
        recurringItems.push(item);

        if (item.PlannedQuantity < item.RecurringQuantity) {
          recurringItemsToAdd.push(item);
        }
      }
      if (item.PlannedQuantity) {
        shoppingList.push(item);
        total += item.PlannedQuantity * item.UnitPriceEstimate;
      } else {
        unselectedItems.push(item);
      }
    });
    const result = { all, shoppingList, unselectedItems, recurringItems, recurringItemsToAdd, total };
    setTimeout(() => {
      Object.values(this.shoppingListConsumers).forEach(consumer => consumer.consumeShoppingList(result));
    });
    return result;
  }

  _supplyMissingFields(item) {
    return {
      LastUpdated: '0000-00-00T00:00:00.000Z',
      PlannedQuantity: 0,
      RecurringQuantity: 0,
      Type: "OTHER",
      ...item
    };
  }

  _getCurrentTimestamp() {
    return this.chronometer.getCurrentTimestamp();
  }

  _generateId(prefix) {
    const randomPart = (
      Math.random().toString(36).slice(2)
      + Math.random().toString(36).slice(2)
    ).slice(0, 12);
    return prefix + randomPart;
  }
}
