import { Chronometer } from './Chronometer';

export class Core {
  constructor(data, chronometer) {
    this.chronometer = chronometer || new Chronometer();
    this.data = data;
    this.shoppingListConsumers = {};
  }

  startShopping(attributes) {
    const shoppingEvent = {
      Id: this._generateTimestampId("s-", 4) + "#description",
      Status: "IN_PROGRESS",
      ...attributes,
    };
    this.shoppingEvent = shoppingEvent;
    this.data.createItem(shoppingEvent);
    return shoppingEvent;
  }

  getShoppingEvent(Id) {
    if (!Id.match(/^s-.*#description$/)) {
      throw new Error('The shopping event description ID must start with "s-" and end with "#description"');
    }
    const description = this.data.getItem(Id);
    return {
      description
    }
  }

  stopShopping(id) {
    const shoppingEvent = this.data.getItem(id);
    if (!shoppingEvent) {
      throw new Error(`Cannot stop Shopping Event ${id}`);
    }
  }

  offShoppingListUpdate(key) {
    delete this.shoppingListConsumers[key];
  }

  onShoppingListUpdate(key, consumeShoppingList) {
    this.shoppingListConsumers[key] = { key, consumeShoppingList };
  }

  addRecurringItems() {
    const toAdd = this.getShoppingList().recurringItemsToAdd;
    const currentTimestamp = this._getCurrentTimestamp();
    this.data.batchUpdateItems(toAdd.map(item => ({
      id: item.Id,
      updates: [
        {
          value: currentTimestamp,
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
    const currentTimestamp = this._getCurrentTimestamp();
    this.data.batchUpdateItems(itemIds.map(id => ({
      id,
      updates: [
        {
          value: currentTimestamp,
          attributeName: 'LastUpdated',
        },
        {
          value: 0,
          attributeName: "PlannedQuantity"
        }
      ]
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
      Id: this._generateId("i-", 12),
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
    console.warn("DEPRECATED. Use getShoppingPlan() instead");
    return this.getShoppingPlan();
  }
  
  getShoppingPlan() {
    const all = [];
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    let totalOfRecurringItems = 0;
    const recurringItemsToAdd = [];
    const recurringItems = [];
    this.data.listItems("i-").map(item => this._supplyMissingFields(item)).forEach(item => {
      all.push(item);
      if (item.RecurringQuantity) {
        recurringItems.push(item);
        totalOfRecurringItems += item.RecurringQuantity * item.UnitPriceEstimate;

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
    const result = { all, shoppingList, unselectedItems, recurringItems, recurringItemsToAdd, total, totalOfRecurringItems };
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
      UnitPriceEstimate: 0,
      Type: "OTHER",
      ...item
    };
  }

  _getCurrentTimestamp() {
    return this.chronometer.getCurrentTimestamp();
  }

  _generateId(prefix, length) {
    const randomPart = (
      Math.random().toString(36).slice(2)
      + Math.random().toString(36).slice(2)
    ).slice(0, length);
    return prefix + randomPart;
  }

  _generateTimestampId(prefix) {
    const timestampPart = this._getCurrentTimestamp()
      .replace(/\d\d\.\d\d\dZ/, '')
      .replace(/[^\d]/g, '');
    return [
      prefix,
      timestampPart,
      this._generateId("-", 6)
    ].join("");
  }
}
