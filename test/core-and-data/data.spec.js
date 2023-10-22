import { testDataSource } from './testDataSource';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sortById } from './standardComparisons';

describe('data', () => {
  let data;

  beforeEach(() => {
    data = testDataSource();
  });

  describe('createItem', () => {
    it('refuses to overwrite an existing item', async () => {
      await data.createItem({ Id: 'TheFirst' });
      await expect(data.createItem({ Id: 'TheFirst' }))
        .rejects.toThrow();
    });
  });

  describe('updateItem', () => {
    it('refuses to create an item', async () => {
      await expect(data.updateItem({ Id: 'TheFirst' }))
        .rejects.toThrow();
    });
  });

  describe('batch get and update', () => {
    it('updates many items', async () => {
      await data.createItem({ Id: 'id-1' });
      await data.createItem({ Id: 'id-2' });
      await data.createItem({ Id: 'id-3' });
      await data.createItem({ Id: 'id-4' });
      await data.batchUpdateItems([
        { id: 'id-1', updates: [{ attributeName: 'Stuff', value: 'forty two' }] },
        { id: 'id-2', updates: [{ attributeName: 'Stuff', value: 'forty two' }] },
        { id: 'id-3', updates: [{ attributeName: 'Stuff', value: 'forty two' }] },
        { id: 'id-4', updates: [{ attributeName: 'Stuff', value: 'forty two' }] }
      ]);
      const items = await data.batchGetItems([ 'id-1', 'id-2', 'id-3', 'id-4' ]);
      expect(items.sort(sortById)).toEqual([
        { Id: 'id-1', Stuff: 'forty two' },
        { Id: 'id-2', Stuff: 'forty two' },
        { Id: 'id-3', Stuff: 'forty two' },
        { Id: 'id-4', Stuff: 'forty two' },
      ]);
    });

    it('updates 100s of items', async () => {
      const numberOfItems = 208;
      const ids = Array.from(Array(numberOfItems).keys())
        .map(i => `00${i}`.slice(-3))
        .map(i => `id-${i}`);
      await Promise.all(ids.map(Id => data.createItem({ Id })));
      await data.batchUpdateItems(ids.map(id =>
        ({ id, updates: [{ attributeName: 'Stuff', value: 'forty two' }] })
      ));
      const items = await data.batchGetItems(ids);
      expect(items.sort(sortById))
        .toEqual(ids.map(Id => ({ Id, Stuff: 'forty two' })));
    });
  });

  describe('addItemValue', () => {

    const numericAttributes = [
      "BoughtQuantity",
      "PlannedQuantity",
      "RequiredQuantity",
      "UnitPriceEstimate",
      "ActualUnitPrice",
      "RecurringQuantity",
      "EstimatedTotal"
    ];

    numericAttributes.forEach(attribute => {
      it(`can increment ${attribute} even if it was created as a string number`, async () => {
        const id = `TestAddItemValue-${uuidv4()}`;
        await data.createItem({ Id: id, [attribute]: "39" });
        await data.addItemValue(id, attribute, 3);
        const result = await data.getItem(id);
        expect(result[attribute]).toEqual(42);
      });

      it(`can increment ${attribute} even if it was updated as a string number`, async () => {
        const id = `TestAddItemValue-${uuidv4()}`;
        await data.createItem({ Id: id });
        await data.updateItem({ Id: id, [attribute]: "39" });
        await data.addItemValue(id, attribute, 3);
        const result = await data.getItem(id);
        expect(result[attribute]).toEqual(42);
      });

      it(`can increment ${attribute} even if it was created with createOrUpdate as a string number`, async () => {
        const id = `TestAddItemValue-${uuidv4()}`;
        await data.createOrUpdateItem({ Id: id, [attribute]: "39" });
        await data.addItemValue(id, attribute, 3);
        const result = await data.getItem(id);
        expect(result[attribute]).toEqual(42);
      });

      it(`can increment ${attribute} even if it was updated with createOrUpdate as a string number`, async () => {
        const id = `TestAddItemValue-${uuidv4()}`;
        await data.createItem({ Id: id });
        await data.createOrUpdateItem({ Id: id, [attribute]: "39" });
        await data.addItemValue(id, attribute, 3);
        const result = await data.getItem(id);
        expect(result[attribute]).toEqual(42);
      });
    });
  });
});
