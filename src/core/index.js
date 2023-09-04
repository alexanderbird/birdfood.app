export class Core {
  constructor(data) {
    this.data = data;
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
      updates: [{
        value: plannedQuantity,
        attributeName: "PlannedQuantity"
      }]
    }]);
  }

  getShoppingList() {
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    this.data.listItems().forEach(item => {
      if (item.PlannedQuantity) {
        shoppingList.push(item);
        total += item.PlannedQuantity * item.UnitPriceEstimate;
      } else {
        unselectedItems.push(item);
      }
    });
    return { shoppingList, unselectedItems, total };
  }
}
