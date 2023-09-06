import { EmptyStaticData } from '../../src/data/static';
import { SteppingChronometer } from '../../src/core/Chronometer';
import { Core } from '../../src/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('core planning APIs', () => {
  let core;
  let data;

  beforeEach(() => {
    data = new EmptyStaticData();
    core = new Core(data, new SteppingChronometer());
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
        LastUpdated: "0000-00-00T00:00:00.000Z",
        PlannedQuantity: 0,
        RecurringQuantity: 0,
        UnitPriceEstimate: 0,
        Type: "OTHER"
      });
    });

    it("generates an Id on create", () => {
      const item = core.createItem({ Name: "jam" });
      expect(item.Id).toMatch(/^i-[a-z0-9]{12}$/);
    });

    it('generates a unique Id each time you create', () => {
      const soMany = 10000;
      const allIds = Array(soMany).fill()
        .map(() => core.createItem({ Name: "Pears" }))
        .map(x => x.Id);
      expect(new Set(allIds).size).toEqual(soMany);
    });

    it('uses all numbers and letters in the ID generation', () => {
      const soMany = 10000;
      const allIdCharacters = Array(soMany).fill()
        .map(() => core.createItem({ Name: "Pears" }))
        .flatMap(x => x.Id.replace("i-", "").split(""))
        .sort();
      const uniqueCharacters = Array.from(new Set(allIdCharacters)).join("");
      expect(uniqueCharacters).toEqual("0123456789abcdefghijklmnopqrstuvwxyz")
    });

    it("accepts all properties other than Id and Timestamp on create", () => {
      const item = core.createItem({
        Name: "jam",
        PlannedQuantity: 3,
        RecurringQuantity: 8,
        UnitPriceEstimate: 2.7,
        Type: "DRY_GOOD"
      });
      expect(item).toEqual({
        Id: item.Id,
        LastUpdated: "0000-00-00T00:00:00.000Z",
        Name: "jam",
        UnitPriceEstimate: 2.7,
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
      expect(LastUpdated).toEqual("0000-00-00T00:00:00.000Z");
    });

    it("can update an item and the item timestamp", () => {
      const originalItem = core.createItem({ Name: "jam" });
      core.updateItemAndTimestamp({ Id: originalItem.Id, Name: "Strawberry Jam" });
      expect(core.getItem(originalItem.Id)).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:00.001Z"
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
        LastUpdated: "0000-00-00T00:00:00.001Z"
      });
    });

    it("can update an item without changing the timestamp", () => {
      const originalItem = core.createItem({ Name: "jam" });
      core.updateItem({ Id: originalItem.Id, Name: "Strawberry Jam" });
      expect(core.getItem(originalItem.Id)).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:00.000Z"
      });
    });
  });

  describe("list and bulk update operations", () => {
    function createItem(core, UnitPriceEstimate, PlannedQuantity, RecurringQuantity, Name, Type) {
      return core.createItem({ Name, UnitPriceEstimate, PlannedQuantity, RecurringQuantity, Type });
    }

    let i1, i2, i3, i4, i5, i6;

    beforeEach(() => {
      // UnitPriceEstimate, PlannedQuantity, RecurringQuantity, Name, Type
      // __________________ ________________ __________________ _____ ____
      i1 = createItem(core, 1.50, 2, 2, "apples"        , "PRODUCE");
      i2 = createItem(core, 2.50, 2, 1, "bananas"       , "PRODUCE");
      i3 = createItem(core, 3.50, 1, 2, "carrots"       , "PRODUCE");
      i4 = createItem(core, 6.00, 0, 2, "donuts (dozen)", "BAKERY");
      i5 = createItem(core, 8.00, 2, 0, "eggs (dozen)"  , "DAIRY");
      i6 = createItem(core, 9.00, 0, 0, "fish"          , "DELI");
    });

    it("can retrieve a full shopping list", () => {
      const plan = core.getShoppingPlan();
      expect(plan).toEqual({
        all: [i1, i2, i3, i4, i5, i6],
        recurringItems: [i1, i2, i3, i4],
        recurringItemsToAdd: [i3, i4],
        shoppingList: [i1, i2, i3, i5],
        unselectedItems: [i4, i6],
        total: 27.5,
        totalOfRecurringItems: 24.5,
      });
    });

    it("includes only item entries when listing items (other database entries are ignored)", () => {
      data.createItem({ Id: "x-123" });
      data.createItem({ Id: "whatever" });
      data.createItem({ Id: "ix000000000000" });
      data.createItem({ Id: "I-000000000000" });
      const plan = core.getShoppingPlan();
      expect(plan.all).toEqual([i1, i2, i3, i4, i5, i6]);
    });

    it("can add all recurring items to the plan", () => {
      core.addRecurringItems();
      const plan = core.getShoppingPlan();
      const i3Updated = {
        ...i3,
        PlannedQuantity: 2,
        LastUpdated: "0000-00-00T00:00:00.006Z"
      }
      const i4Updated = {
        ...i4,
        PlannedQuantity: 2,
        LastUpdated: "0000-00-00T00:00:00.006Z"
      }
      expect(plan).toEqual({
        all: [i1, i2, i3Updated, i4Updated, i5, i6],
        recurringItems: [i1, i2, i3Updated, i4Updated],
        recurringItemsToAdd: [],
        shoppingList: [i1, i2, i3Updated, i4Updated, i5],
        unselectedItems: [i6],
        total: 43,
        totalOfRecurringItems: 24.5,
      });
    });

    it("can remove a batch of items from the plan", () => {
      core.removeItemsFromShoppingList([
        i2.Id, i3.Id
      ]);
      const i2Updated = {
        ...i2,
        PlannedQuantity: 0,
        LastUpdated: "0000-00-00T00:00:00.006Z"
      }
      const i3Updated = {
        ...i3,
        PlannedQuantity: 0,
        LastUpdated: "0000-00-00T00:00:00.006Z"
      }
      const plan = core.getShoppingPlan();
      expect(plan).toEqual({
        all: [i1, i2Updated, i3Updated, i4, i5, i6],
        recurringItems: [i1, i2Updated, i3Updated, i4],
        recurringItemsToAdd: [i2Updated, i3Updated, i4],
        shoppingList: [i1, i5],
        unselectedItems: [i2Updated, i3Updated, i4, i6],
        total: 19,
        totalOfRecurringItems: 24.5,
      });
    });
  });

  describe("shopping list subscriptions", () => {
    async function clearEventQueue() {
      await new Promise(x => setTimeout(x));
    }

    function expectedCart(...items) {
      return {
        all: items,
        recurringItems: [],
        recurringItemsToAdd: [],
        shoppingList: [],
        unselectedItems: items,
        total: 0,
        totalOfRecurringItems: 0,
      };
    }
    it("can subscribe to shopping list updates", async () => {
      const apples = core.createItem({ Name: "Apples" });
      const bananas = core.createItem({ Name: "Bananas" });
      let plan;
      core.onShoppingListUpdate("test-subscription", x => { plan = x; });
      expect(plan).toBeUndefined();
      core.getShoppingPlan()
      await clearEventQueue();
      expect(plan).toEqual(expectedCart(apples, bananas));
      const applesUpdated = { ...apples, Name: "Apples (Fuji)" };
      core.updateItem(applesUpdated);
      await clearEventQueue();
      expect(plan).toEqual(expectedCart(apples, bananas));
      core.getShoppingPlan()
      await clearEventQueue();
      expect(plan).toEqual(expectedCart(applesUpdated, bananas));
    });

    it("can subscribe multiple times to shopping list updates", async () => {
      let plan1;
      let plan2;
      core.onShoppingListUpdate("the-first", x => { plan1 = x; });
      core.onShoppingListUpdate("the-second", x => { plan2 = x; });
      const item = core.createItem({ Name: "X" });
      core.getShoppingPlan()
      await clearEventQueue();
      expect(plan1.all).toEqual([item]);
      expect(plan2.all).toEqual([item]);
    });

    it("can unsubscribe to shopping list updates", async () => {
      let plan;
      core.onShoppingListUpdate("test-subscription", x => { plan = x; });
      const item = core.createItem({ Name: "X" });
      core.getShoppingPlan()
      await clearEventQueue();
      expect(plan.all).toEqual([item]);
      core.offShoppingListUpdate("test-subscription");
      core.createItem({ Name: "Y" });
      core.getShoppingPlan()
      await clearEventQueue();
      expect(plan.all).toEqual([item]);
    });

    it("can override a shopping list update subscription", async () => {
      const calls = [];
      core.onShoppingListUpdate("test-subscription", () => calls.push("first"));
      core.getShoppingPlan()
      await clearEventQueue();
      core.onShoppingListUpdate("test-subscription", () => calls.push("second"));
      core.getShoppingPlan()
      await clearEventQueue();
      expect(calls).toEqual(["first", "second"]);
    });
  });

  // TODO: everything should be async to prepare for a real database
});
