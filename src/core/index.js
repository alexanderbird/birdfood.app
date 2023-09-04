export class Core {
  constructor(data) {
    this.data = data;
  }

  addRecurringItems() {
    const lastUpdated = new Date(Date.now()).toISOString();
    this.data.batchUpdateItems(this.getShoppingList().recurringItemsToAdd.map(item => ({
      id: item.Id,
      updates: [
        {
          value: lastUpdated,
          attributeName: 'LastUpdated',
        },
        {
          value: Math.max(item.PlannedQuantity, item.RecurringQuantity),
          attributeName: "PlannedQuantity"
        }
      ]
    })));
  }

  addToItemShoppingListQuantity(id, addend) {
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

  createItem(attributes) {
    this.data.createItem({
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
      Id: 'i-' + ((Math.random().toString(36) + "00").slice(2))
    })
  }

  setItemPlannedQuantity(id, plannedQuantity) {
    const lastUpdated = new Date(Date.now()).toISOString();
    this.data.batchUpdateItems([{
      id,
      updates: [
        {
          value: lastUpdated,
          attributeName: 'LastUpdated',
        },
        {
          value: plannedQuantity,
          attributeName: "PlannedQuantity"
        }
      ]
    }]);
  }

  getEmptyShoppingList() {
    return { shoppingList: [], unselectedItems: [], recurringItemsToAdd: [], total: 0 }
  }

  getShoppingList() {
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    const recurringItemsToAdd = [];
    this.data.listItems().map(item => this._supplyMissingFields(item)).forEach(item => {
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
    return { shoppingList, unselectedItems, recurringItemsToAdd, total };
  }

  _supplyMissingFields(item) {
    return {
      LastUpdated: '0000-00-00T00:00:00.000Z',
      PlannedQuantity: 0,
      RecurringQuantity: 0,
      Type: "OTHER",
      ...item
    }
  }

  _getCurrentTimestamp() {
    return new Date(Date.now()).toISOString();
  }


}
