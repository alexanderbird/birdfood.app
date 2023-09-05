export class Core {
  constructor(data) {
    this.data = data;
    this.shoppingListConsumers = {};
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

  removeItemsFromShoppingList(itemIds) {
    this.data.batchUpdateItems(itemIds.map(id => ({
      id,
      updates: [{
        value: 0,
        attributeName: "PlannedQuantity"
      }]
    })));
  }

  updateItem(attributes) {
    this.data.updateItem(attributes);
  }

  createItem(attributes) {
    const item = {
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
      Id: `i-${  (`${Math.random().toString(36)  }00`).slice(2)}`
    };
    this.data.createItem(item);
    return item;
  }

  updateItemAndTimestamp(attributes) {
    this.data.updateItem({
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
    });
  }

  getEmptyShoppingList() {
    return { all: [], shoppingList: [], unselectedItems: [], recurringItemsToAdd: [], total: 0 };
  }

  getShoppingList() {
    const all = [];
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    const recurringItemsToAdd = [];
    this.data.listItems().map(item => this._supplyMissingFields(item)).forEach(item => {
      all.push(item);
      if (item.PlannedQuantity < item.RecurringQuantity) {
        recurringItemsToAdd.push(item);
      }
      if (item.PlannedQuantity) {
        shoppingList.push(item);
        total += item.PlannedQuantity * item.UnitPriceEstimate;
      } else {
        unselectedItems.push(item);
      }
    });
    const result = { all, shoppingList, unselectedItems, recurringItemsToAdd, total };
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
    return new Date(Date.now()).toISOString();
  }


}
