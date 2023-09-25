import { SteppingChronometer } from '../../src/core/Chronometer';
import { Core } from '../../src/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { testDataSource } from './testDataSource';
import { sortById, sortByName, sortByDate } from './standardComparisons';

describe('item purchase history APIs', () => {
  let core;
  let data;
  beforeEach(() => {
    data = testDataSource();
    core = new Core(data, new SteppingChronometer());
  });

  it('requires an item', async () => {
    await expect(() => core.listItemPurchaseHistory())
      .rejects.toThrow("Missing required parameter itemId");
  });

  it('returns an empty list when there is no purchase history', async () => {
    const itemId = "i-111111111111"
    const history = await core.listItemPurchaseHistory(itemId);
    expect(history).toEqual([]);
  });

  it('returns the purchase history', async () => {
    const itemId = "i-111111111111"
    await core.buyItem((await core.startShopping({ Store: 'Costco' })).Id, { ItemId: itemId, ActualUnitPrice: 2.21, Quantity: 4 });
    await core.buyItem((await core.startShopping({ Store: 'Safeway' })).Id, { ItemId: itemId, ActualUnitPrice: 1.99, Quantity: 1 });
    await core.buyItem((await core.startShopping({ Store: 'Safeway' })).Id, { ItemId: itemId, ActualUnitPrice: 3.06, Quantity: 2 });
    await core.buyItem((await core.startShopping({ Store: 'Costco' })).Id, { ItemId: itemId, ActualUnitPrice: 2.00, Quantity: 8 });
    await core.buyItem((await core.startShopping({ Store: 'Safeway' })).Id, { ItemId: itemId, ActualUnitPrice: 4.99, Quantity: 2 });
    const history = await core.listItemPurchaseHistory(itemId);
    expect(history.sort(sortByDate).map(({ Date, ActualUnitPrice, BoughtQuantity, Store }) => ({ Date, ActualUnitPrice, BoughtQuantity, Store }))).toEqual([
      { Date: '0000-00-00T00:00:00.000Z', ActualUnitPrice: 2.21, BoughtQuantity: 4, Store: 'Costco' },
      { Date: '0000-00-00T00:00:00.001Z', ActualUnitPrice: 1.99, BoughtQuantity: 1, Store: 'Safeway' },
      { Date: '0000-00-00T00:00:00.002Z', ActualUnitPrice: 3.06, BoughtQuantity: 2, Store: 'Safeway' },
      { Date: '0000-00-00T00:00:00.003Z', ActualUnitPrice: 2.00, BoughtQuantity: 8, Store: 'Costco' },
      { Date: '0000-00-00T00:00:00.004Z', ActualUnitPrice: 4.99, BoughtQuantity: 2, Store: 'Safeway' }
    ]);
  });

  it('excludes history of other items', async () => {
    await core.buyItem((await core.startShopping({ Store: 'Costco' })).Id, { ItemId: 'i-11', ActualUnitPrice: 2.21, Quantity: 4 });
    await core.buyItem((await core.startShopping({ Store: 'Safeway' })).Id, { ItemId: 'i-22', ActualUnitPrice: 1.99, Quantity: 1 });
    await core.buyItem((await core.startShopping({ Store: 'Safeway' })).Id, { ItemId: 'i-33', ActualUnitPrice: 3.06, Quantity: 2 });
    const history = await core.listItemPurchaseHistory('i-22');
    expect(history.map(({ Date, ActualUnitPrice, BoughtQuantity, Store }) => ({ Date, ActualUnitPrice, BoughtQuantity, Store }))).toEqual([
      { Date: '0000-00-00T00:00:00.001Z', ActualUnitPrice: 1.99, BoughtQuantity: 1, Store: 'Safeway' },
    ]);
  });
});
