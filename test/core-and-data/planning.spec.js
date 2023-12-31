import { testDataSource } from './testDataSource';
import { SteppingChronometer } from '../../src/core/Chronometer';
import { Core } from '../../src/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { sortById } from './standardComparisons';

describe('core planning APIs', () => {
  let core;
  let data;

  beforeEach(() => {
    data = testDataSource();
    core = new Core(data, new SteppingChronometer());
  });

  function sorted(plan) {
    if (!plan) {
      return plan;
    }
    return {
      ...plan,
      all: plan.all?.sort(sortById),
      recurringItems: plan.recurringItems?.sort(sortById),
      recurringItemsToAdd: plan.recurringItemsToAdd?.sort(sortById),
      shoppingList: plan.shoppingList?.sort(sortById),
      unselectedItems: plan.unselectedItems?.sort(sortById),
    }
  }

  describe("create, read, and update operations", () => {
    it("can increment an item recurring quantity", async () => {
      const { Id } = await core.createPlanItem({ Name: "jam" });
      await core.addToItemRecurringQuantity(Id, 2);
      expect((await core.getItem(Id)).RecurringQuantity).toEqual(2);
      await core.addToItemRecurringQuantity(Id, 4);
      expect((await core.getItem(Id)).RecurringQuantity).toEqual(6);
      await core.addToItemRecurringQuantity(Id, -3);
      expect((await core.getItem(Id)).RecurringQuantity).toEqual(3);
    });

    it("can increment an item planned quantity", async () => {
      const { Id } = await core.createPlanItem({ Name: "jam" });
      core.addToItemPlannedQuantity(Id, 2);
      expect((await core.getItem(Id)).PlannedQuantity).toEqual(2);
      await core.addToItemPlannedQuantity(Id, 4);
      expect((await core.getItem(Id)).PlannedQuantity).toEqual(6);
      await core.addToItemPlannedQuantity(Id, -3);
      expect((await core.getItem(Id)).PlannedQuantity).toEqual(3);
    });

    it("requires a name when creating", async () => {
      expect(() => core.createPlanItem({ }))
        .rejects.toThrow("Name is required.");
    });

    it("can create an item with only a name", async () => {
      const item = await core.createPlanItem({ Name: "jam" });
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

    it("accepts all properties other than Id and Timestamp on create", async () => {
      const item = await core.createPlanItem({
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

    it("generates an Id on create (even if one was passed as an argument)", async () => {
      const { Id } = await core.createPlanItem({ Id: "i-xxxxxxxxxxxx", Name: "jam" });
      expect(Id).not.toEqual("i-xxxxxxxxxxxx");
    });

    it("sets the timestamp on create (even if one was passed as an argument)", async () => {
      const { LastUpdated } = await core.createPlanItem({ LastUpdated: "1111-11-11T11:11:111Z", Name: "jam" });
      expect(LastUpdated).toEqual("0000-00-00T00:00:00.000Z");
    });

    it("can update an item and the item timestamp", async () => {
      const originalItem = await core.createPlanItem({ Name: "jam" });
      await core.updateItemAndTimestamp({ Id: originalItem.Id, Name: "Strawberry Jam" });
      expect((await core.getItem(originalItem.Id))).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:00.001Z"
      });
    });

    it("prevents overriding timestamp when updating", async () => {
      const originalItem = await core.createPlanItem({ Name: "jam" });
      await core.updateItemAndTimestamp({
        Id: originalItem.Id,
        Name: "Strawberry Jam",
        LastUpdated: "1111-11-11T11:11:111Z"
      });
      expect((await core.getItem(originalItem.Id))).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:00.001Z"
      });
    });

    it("can update an item without changing the timestamp", async () => {
      const originalItem = await core.createPlanItem({ Name: "jam" });
      await core.updateItem({ Id: originalItem.Id, Name: "Strawberry Jam" });
      expect((await core.getItem(originalItem.Id))).toEqual({
        ...originalItem,
        Name: "Strawberry Jam",
        LastUpdated: "0000-00-00T00:00:00.000Z"
      });
    });
  });

  describe("list and bulk update operations", () => {
    async function createItem(core, UnitPriceEstimate, PlannedQuantity, RecurringQuantity, Name, Type) {
      return await core.createPlanItem({ Name, UnitPriceEstimate, PlannedQuantity, RecurringQuantity, Type });
    }

    let i1, i2, i3, i4, i5, i6;

    beforeEach(async () => {
      // UnitPriceEstimate, PlannedQuantity, RecurringQuantity, Name, Type
      // __________________ ________________ __________________ _____ ____
      i1 = await createItem(core, 1.50, 2, 2, "apples"        , "PRODUCE");
      i2 = await createItem(core, 2.50, 2, 1, "bananas"       , "PRODUCE");
      i3 = await createItem(core, 3.50, 1, 2, "carrots"       , "PRODUCE");
      i4 = await createItem(core, 6.00, 0, 2, "donuts (dozen)", "BAKERY");
      i5 = await createItem(core, 8.00, 2, 0, "eggs (dozen)"  , "DAIRY");
      i6 = await createItem(core, 9.00, 0, 0, "fish"          , "DELI");
    });

    it("can retrieve a full shopping list", async () => {
      const plan = await core.getShoppingPlan();
      expect(sorted(plan)).toEqual(sorted({
        all: [i1, i2, i3, i4, i5, i6],
        recurringItems: [i1, i2, i3, i4],
        recurringItemsToAdd: [i3, i4],
        shoppingList: [i1, i2, i3, i5],
        unselectedItems: [i4, i6],
        total: 27.5,
        totalOfRecurringItems: 24.5,
      }));
    });

    it("includes only item entries when listing items (other database entries are ignored)", async () => {
      await data.createItem({ Id: "x-123" });
      await data.createItem({ Id: "whatever" });
      await data.createItem({ Id: "ix000000000000" });
      await data.createItem({ Id: "I-000000000000" });
      const plan = await core.getShoppingPlan();
      expect(plan.all.sort(sortById)).toEqual([i1, i2, i3, i4, i5, i6].sort(sortById));
    });

    it("can add all recurring items to the plan", async () => {
      await core.addRecurringItems();
      const plan = await core.getShoppingPlan();
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
      expect(sorted(plan)).toEqual(sorted({
        all: [i1, i2, i3Updated, i4Updated, i5, i6],
        recurringItems: [i1, i2, i3Updated, i4Updated],
        recurringItemsToAdd: [],
        shoppingList: [i1, i2, i3Updated, i4Updated, i5],
        unselectedItems: [i6],
        total: 43,
        totalOfRecurringItems: 24.5,
      }));
    });

    it("can remove a batch of items from the plan", async () => {
      await core.removeItemsFromShoppingList([
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
      const plan = await core.getShoppingPlan();
      expect(sorted(plan)).toEqual(sorted({
        all: [i1, i2Updated, i3Updated, i4, i5, i6],
        recurringItems: [i1, i2Updated, i3Updated, i4],
        recurringItemsToAdd: [i2Updated, i3Updated, i4],
        shoppingList: [i1, i5],
        unselectedItems: [i2Updated, i3Updated, i4, i6],
        total: 19,
        totalOfRecurringItems: 24.5,
      }));
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
        unselectedItems: items.sort(sortById),
        total: 0,
        totalOfRecurringItems: 0,
      };
    }
    it("can subscribe to shopping list updates", async () => {
      const apples = await core.createPlanItem({ Name: "Apples" });
      const bananas = await core.createPlanItem({ Name: "Bananas" });
      let plan;
      core.onShoppingListUpdate("test-subscription", x => { plan = x; });
      expect(sorted(plan)).toBeUndefined();
      await core.getShoppingPlan()
      await clearEventQueue();
      expect(sorted(plan)).toEqual(expectedCart(apples, bananas));
      const applesUpdated = { ...apples, Name: "Apples (Fuji)" };
      await core.updateItem(applesUpdated);
      await clearEventQueue();
      expect(sorted(plan)).toEqual(expectedCart(apples, bananas));
      await core.getShoppingPlan()
      await clearEventQueue();
      expect(sorted(plan)).toEqual(expectedCart(applesUpdated, bananas));
    });

    it("can subscribe multiple times to shopping list updates", async () => {
      let plan1;
      let plan2;
      core.onShoppingListUpdate("the-first", x => { plan1 = x; });
      core.onShoppingListUpdate("the-second", x => { plan2 = x; });
      const item = await core.createPlanItem({ Name: "X" });
      await core.getShoppingPlan()
      await clearEventQueue();
      expect(plan1.all).toEqual([item]);
      expect(plan2.all).toEqual([item]);
    });

    it("can unsubscribe to shopping list updates", async () => {
      let plan;
      core.onShoppingListUpdate("test-subscription", x => { plan = x; });
      const item = await core.createPlanItem({ Name: "X" });
      await core.getShoppingPlan()
      await clearEventQueue();
      expect(plan.all).toEqual([item]);
      core.offShoppingListUpdate("test-subscription");
      await core.createPlanItem({ Name: "Y" });
      await core.getShoppingPlan()
      await clearEventQueue();
      expect(plan.all).toEqual([item]);
    });

    it("can override a shopping list update subscription", async () => {
      const calls = [];
      core.onShoppingListUpdate("test-subscription", () => calls.push("first"));
      await core.getShoppingPlan()
      await clearEventQueue();
      core.onShoppingListUpdate("test-subscription", () => calls.push("second"));
      await core.getShoppingPlan()
      await clearEventQueue();
      expect(calls).toEqual(["first", "second"]);
    });
  });
});
