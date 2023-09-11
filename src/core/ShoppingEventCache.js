export class ShoppingEventCache {
  constructor(list, statistics, updateItem) {
    this._list = list;
    this._statistics = statistics;
    this._updateItem = updateItem;
  }

  static assemble({ updateItem, shoppingEventItems, planItems }) {
    const list = [];
    const completedItems = Object.fromEntries(
      shoppingEventItems.map(x => [x.Id.replace(/^sei#se-[0-9a-z-]+#/, ''), x]));

    const unprocessedCompletedItems = new Set(Object.keys(completedItems));

    const planItemsMap = {};
    planItems.forEach(planItem => {
      planItemsMap[planItem.Id] = planItem;
      if (planItem.PlannedQuantity) {
        const plannedItem = planItem;
        unprocessedCompletedItems.delete(plannedItem.Id);
        list.push(this._assembleItemForShoppingEvent(plannedItem, completedItems[plannedItem.Id]));
      }
    });

    list.push(...Array.from(unprocessedCompletedItems)
      .map(id => planItemsMap[id])
      .map(plannedItem => this._assembleItemForShoppingEvent(plannedItem, completedItems[plannedItem.Id])));

    const statistics = this._computeStatistics(list);

    return new ShoppingEventCache(list, statistics, updateItem);
  }

  getList() {
    return this._list;
  }

  getStatistics() {
    return this._statistics;
  }

  static _computeStatistics(list) {
    return list.reduce((statistics, item) => {
      const actual = item.BoughtQuantity * (item.ActualUnitPrice || item.UnitPriceEstimate || 0);
      const expected = item.RequiredQuantity * (item.UnitPriceEstimate || 0);
      return {
        runningTotal: statistics.runningTotal + actual,
        estimatedTotal: statistics.estimatedTotal + expected,
      };
    }, { runningTotal: 0, estimatedTotal: 0 });
  }

  static _assembleItemForShoppingEvent(plannedItem, completedItem) {
    return ({
      Id: plannedItem.Id,
      Name: plannedItem.Name,
      Type: plannedItem.Type || 'OTHER',
      RequiredQuantity: plannedItem.PlannedQuantity,
      UnitPriceEstimate: plannedItem.UnitPriceEstimate,
      BoughtQuantity: completedItem?.BoughtQuantity || 0,
      ActualUnitPrice: completedItem?.ActualUnitPrice
    });
  }

}
