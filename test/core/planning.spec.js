import { EmptyStaticData } from '../../src/data/static';
import { Core } from '../../src/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('core planning APIs', () => {
  let core;

  beforeEach(() => {
    core = new Core(new EmptyStaticData());
  });

  describe("create, read, and update operations", () => {
    it("can increment an item recurring quantity", () => {
      const { Id } = core.createItem({ Name: "jam" });
      core.addToItemRecurringQuantity(Id, 2);
      expect(core.getItem(Id).RecurringQuantity).toEqual(2);
      core.addToItemRecurringQuantity(Id, 4);
      expect(core.getItem(Id).RecurringQuantity).toEqual(6);
      core.addToItemRecurringQuantity(Id, -3);
      expect(core.getItem(Id).RecurringQuantity).toEqual(3);
    });

    it("can increment an item planned quantity", () => {
      const { Id } = core.createItem({ Name: "jam" });
      core.addToItemPlannedQuantity(Id, 2);
      expect(core.getItem(Id).PlannedQuantity).toEqual(2);
      core.addToItemPlannedQuantity(Id, 4);
      expect(core.getItem(Id).PlannedQuantity).toEqual(6);
      core.addToItemPlannedQuantity(Id, -3);
      expect(core.getItem(Id).PlannedQuantity).toEqual(3);
    });

    it("requires a name when creating", () => {
      expect(() => core.createItem({ }))
        .toThrow("Name is required.");
    });

    it.skip("can update an item and the item timestamp", () => { });
    it.skip("generates an Id on create", () => {});
    it.skip("generates an Id on create (even if one was passed as an argument)", () => {});
    it.skip("sets the timestamp on create", () => {});
    it.skip("sets the timestamp on create (even if one was passed as an argument)", () => {});
  });

  describe("advaned operations", () => {
    it.skip("can add all recurring items to the plan", () => { });
    it.skip("can remove a batch of items from the plan", () => { });
  });

  describe("list operations", () => {
    it.skip("can retrieve an empty shopping list", () => { });
    it.skip("can retrieve a full shopping list", () => { });
  });

  describe('subscribing to changes', () => {
    it.skip("can subscribe to shopping list updates", () => { });
    it.skip("can unsubscribe to shopping list updates", () => { });
    it.skip("can override a shopping list update subscription", () => { });
  });

  // everything is async
});
