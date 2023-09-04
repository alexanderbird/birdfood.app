export class Core {
  constructor(data) {
    this.data = data;
  }

  getShoppingList() {
    const shoppingList = [];
    const unselectedItems = [];
    this.data.listItems().forEach(item => {
      if (item.Quantity) {
        shoppingList.push(item);
      } else {
        unselectedItems.push(item);
      }
    });
    return { shoppingList, unselectedItems };
  }
}
