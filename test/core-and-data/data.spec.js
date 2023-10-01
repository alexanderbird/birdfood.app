import { testDataSource } from './testDataSource';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
