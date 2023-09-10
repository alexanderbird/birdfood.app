import { ShoppingEventCache } from '../../src/core/ShoppingEventCache';
import { describe, it, expect, beforeEach, vi } from 'vitest';
describe(ShoppingEventCache, () => {
  const planItem = (Id, PlannedQuantity) => ({ Id, PlannedQuantity });
  const shopItem = (Id, BoughtQuantity) => ({ Id, BoughtQuantity });

  it('exposes a list that combines the plan and the completed items quantities', () => {
    const planItems = [
      planItem("i-AAAA", 2),
      planItem("i-BBBB", 3),
      planItem("i-CCCC", 4),
      planItem("i-DDDD", 5),
      planItem("i-EEEE", 6),
      planItem("i-FFFF", 0),
      planItem("i-GGGG", 0),
      planItem("i-HHHH", 0)
    ];
    const shoppingEventItems =[
      shopItem("sei#se-9999999999-zzzzzzzz#i-BBBB", 3),
      shopItem("sei#se-9999999999-zzzzzzzz#i-CCCC", 2),
      shopItem("sei#se-9999999999-zzzzzzzz#i-DDDD", 10),
      shopItem("sei#se-9999999999-zzzzzzzz#i-EEEE", 0),
      shopItem("sei#se-9999999999-zzzzzzzz#i-GGGG", 2),
      shopItem("sei#se-9999999999-zzzzzzzz#i-HHHH", 3)
    ];

    const cache = ShoppingEventCache.assemble({
      updateItem: () => { throw new Error("nope"); },
      shoppingEventItems,
      planItems
    });

    const list = cache.getList();
    const actual = list.map(({ Id, RequiredQuantity, BoughtQuantity }) => ({ Id, RequiredQuantity, BoughtQuantity }))
    expect(actual).toEqual([
      { Id: "i-AAAA", RequiredQuantity: 2, BoughtQuantity: 0 },
      { Id: "i-BBBB", RequiredQuantity: 3, BoughtQuantity: 3 },
      { Id: "i-CCCC", RequiredQuantity: 4, BoughtQuantity: 2 },
      { Id: "i-DDDD", RequiredQuantity: 5, BoughtQuantity: 10 },
      { Id: "i-EEEE", RequiredQuantity: 6, BoughtQuantity: 0 },
      /* no F */
      { Id: "i-GGGG", RequiredQuantity: 0, BoughtQuantity: 2 },
      { Id: "i-HHHH", RequiredQuantity: 0, BoughtQuantity: 3 },
    ]);
  });

  it('correctly merges Name, ActualUnitPrice, UnitPriceEstimate, Type for all items', () => {
    const planItems = [
      { Id: "i-AAAA", PlannedQuantity: 1, Name: "Apples", UnitPriceEstimate: 22, Type: "PRODUCE" },
      { Id: "i-BBBB", PlannedQuantity: 1, Name: "Bananas", UnitPriceEstimate: 1.34, Type: "PRODUCE" },
      { Id: "i-CCCC", PlannedQuantity: 0, Name: "Carrots" },
      { Id: "i-DDDD", PlannedQuantity: 1, Name: "Donuts" },
    ];
    const shoppingEventItems =[
      { Id: "sei#se-9999999999-zzzzzzzz#i-AAAA", ActualUnitPrice: 34 },
      { Id: "sei#se-9999999999-zzzzzzzz#i-CCCC", ActualUnitPrice: 4.2 },
      { Id: "sei#se-9999999999-zzzzzzzz#i-DDDD" },
    ];

    const cache = ShoppingEventCache.assemble({
      updateItem: () => { throw new Error("nope"); },
      shoppingEventItems,
      planItems
    });

    const list = cache.getList();
    const actual = list.map(({ Id, Name, ActualUnitPrice, UnitPriceEstimate, Type }) => ({ Id, Name, ActualUnitPrice, UnitPriceEstimate, Type }))
    expect(actual).toEqual([
      { Id: "i-AAAA", Name: "Apples", ActualUnitPrice: 34, UnitPriceEstimate: 22,   Type: "PRODUCE" },
      { Id: "i-BBBB", Name: "Bananas",                     UnitPriceEstimate: 1.34, Type: "PRODUCE" },
      { Id: "i-DDDD", Name: "Donuts",                                               Type: "OTHER" },
      { Id: "i-CCCC", Name: "Carrots", ActualUnitPrice: 4.2,                        Type: "OTHER" },
    ]);
  });

  it('exposes statistics related to the list', () => {
    const planItems = [
      { Id: "i-AAAA", PlannedQuantity: 2, UnitPriceEstimate: 1 },
      { Id: "i-BBBB", PlannedQuantity: 2, UnitPriceEstimate: 10 },
      { Id: "i-CCCC", PlannedQuantity: 2, UnitPriceEstimate: 100 },
    ];
    const shoppingEventItems =[
      { Id: "sei#se-9999999999-zzzzzzzz#i-AAAA", BoughtQuantity: 3, ActualUnitPrice: 2 },
      { Id: "sei#se-9999999999-zzzzzzzz#i-BBBB", BoughtQuantity: 0, ActualUnitPrice: 20 },
      { Id: "sei#se-9999999999-zzzzzzzz#i-CCCC", BoughtQuantity: 1, ActualUnitPrice: 200 },
    ];

    const cache = ShoppingEventCache.assemble({
      updateItem: () => { throw new Error("nope"); },
      shoppingEventItems,
      planItems
    });

    const statistics = cache.getStatistics();
    expect(statistics).toEqual({
      runningTotal: 206,
      estimatedTotal: 222
    });
  });
  
  // handles missing UnitPriceEstimate well

  describe('updating an item', () => {
    it.skip('updates the list without re-fetching the data', () => {});
    it.skip('updates the statistics without re-fetching the data', () => {});
    it.skip('updates the system of record', () => {});
  });
});

