export class Core {
  constructor(data) {
    this.data = data;
  }

  addRecurringItems() {
    this.data.batchUpdateItems(this.data.listItems().map(item => ({
      id: item.Id,
      updates: [{
        value: Math.max(item.PlannedQuantity, item.RecurringQuantity),
        attributeName: "PlannedQuantity"
      }]
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

  setItemPlannedQuantity(id, plannedQuantity) {
    this.data.batchUpdateItems([{
      id,
      updates: [
        {
          value: new Date(Date.now()).toISOString(),
          attributeName: 'LastUpdated',
        },
        {
          value: plannedQuantity,
          attributeName: "PlannedQuantity"
        }
      ]
    }]);
  }

  getShoppingList() {
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    this.data.listItems().map(item => this._supplyMissingFields(item)).forEach(item => {
      if (item.PlannedQuantity) {
        shoppingList.push(item);
        total += item.PlannedQuantity * item.UnitPriceEstimate;
      } else {
        unselectedItems.push(item);
      }
    });
    return { shoppingList, unselectedItems, total };
  }

  _supplyMissingFields(item) {
    return {
      LastUpdated: '0000-00-00T00:00:00.000Z',
      ...item
    }
  }
}
