import { EmptyStaticData } from '../../src/data/static';
import { SteppingChronometer } from '../../src/core/Chronometer';
import { Core } from '../../src/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('core planning APIs', () => {
  let core;

  beforeEach(() => {
    core = new Core(new EmptyStaticData(), new SteppingChronometer());
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

    it("can create an item with only a name", () => {
      const item = core.createItem({ Name: "jam" });
      expect(item).toEqual({
        Id: item.Id,
        Name: "jam",
        LastUpdated: "0000-00-00T00:00:000Z",
        PlannedQuantity: 0,
        RecurringQuantity: 0,
        Type: "OTHER"
      });
    });

    it("generates an Id on create", () => {
      const item = core.createItem({ Name: "jam" });
      expect(item.Id).toMatch(/^i-[a-z0-9]{12}$/);
    });

    it("accepts all properties other than Id and Timestamp on create", () => {
      const item = core.createItem({
        Name: "jam",
        PlannedQuantity: 3,
        RecurringQuantity: 8,
        Type: "DRY_GOOD"
      });
      expect(item).toEqual({
        Id: item.Id,
        LastUpdated: "0000-00-00T00:00:000Z",
        Name: "jam",
        PlannedQuantity: 3,
        RecurringQuantity: 8,
        Type: "DRY_GOOD"
      });
    });

    it("generates an Id on create (even if one was passed as an argument)", () => {
      const { Id } = core.createItem({ Id: "i-xxxxxxxxxxxx", Name: "jam" });
      expect(Id).not.toEqual("i-xxxxxxxxxxxx");
    });

    it("sets the timestamp on create (even if one was passed as an argument)", () => {
      const { LastUpdated } = core.createItem({ LastUpdated: "1111-11-11T11:11:111Z", Name: "jam" });
      expect(LastUpdated).toEqual("0000-00-00T00:00:000Z");
    });

    it("can update an item and the item timestamp", () => {
      const originalItem = core.createItem({ Name: "jam" });
      core.updateItemAndTimestamp({ Id: originalItem.Id, Name: "Strawberry Jam" });
      expect(core.getItem(originalItem.Id)).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:001Z"
      });
    });

    it("prevents overriding timestamp when updating", () => {
      const originalItem = core.createItem({ Name: "jam" });
      core.updateItemAndTimestamp({
        Id: originalItem.Id,
        Name: "Strawberry Jam",
        LastUpdated: "1111-11-11T11:11:111Z"
      });
      expect(core.getItem(originalItem.Id)).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:001Z"
      });
    });

    it("can update an item without changing the timestamp", () => {
      const originalItem = core.createItem({ Name: "jam" });
      core.updateItem({ Id: originalItem.Id, Name: "Strawberry Jam" });
      expect(core.getItem(originalItem.Id)).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:000Z"
      });
    });
  });

  describe("list operations", () => {
    it.skip("can retrieve a full shopping list", () => { });
  });

  describe("advaned operations", () => {
    it.skip("can add all recurring items to the plan", () => { });
    it.skip("can remove a batch of items from the plan", () => { });
  });

  describe('subscribing to changes', () => {
    it.skip("can subscribe to shopping list updates", () => { });
    it.skip("can unsubscribe to shopping list updates", () => { });
    it.skip("can override a shopping list update subscription", () => { });
  });

  // everything is async
});
