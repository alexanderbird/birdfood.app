import { SteppingChronometer } from '../../src/core/Chronometer';
import { Core } from '../../src/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { testDataSource } from './testDataSource';
import { sortById, sortByName } from './standardComparisons';

describe('core shopping APIs', () => {
  let core;
  let data;
  let chronometer;
  beforeEach(() => {
    chronometer = { getCurrentTimestamp: vi.fn() };
    chronometer.getCurrentTimestamp.mockReturnValue("0000-00-00T00:00:00.000Z");
    data = testDataSource();
    core = new Core(data, chronometer);
  });

  describe('starting a shop', () => {
    it('persists the shopping event in the database', async () => {
      const otherCore = new Core(data);
      const { Id: shoppingEventId } = await core.startShopping();
      expect(() => otherCore.stopShopping(shoppingEventId))
        .not.toThrow();
    });

    it("does not allow overriding ID or status", async () => {
      chronometer.getCurrentTimestamp.mockReturnValue("1999-12-31T18:45:26.184Z");
      const shoppingEvent = await core.startShopping({ Id: "1111", Status: "NOPE" });
      expect(shoppingEvent.Status).toEqual("IN_PROGRESS");
      expect(shoppingEvent.Id).toMatch(/^se-199912311845-[a-z0-9]{8}$/);
    });
  });

  describe('completing items during a shopping event', () => {
    it("can complete items for a shopping event", async () => {
      const shoppingEvent = await core.startShopping();
      const itemId = "i-111111111111"
      const boughtItem = await core.buyItem(shoppingEvent.Id, { ItemId: itemId, ActualUnitPrice: 2.21, Quantity: 4 });
      expect(boughtItem).toEqual({
        Id: 'sei#' + shoppingEvent.Id + "#" + itemId,
        ItemId: itemId,
        ActualUnitPrice: 2.21,
        BoughtQuantity: 4
      });
    });

    it("requires an ItemId", async () => {
      const shoppingEvent = await core.startShopping();
      await expect(() => core.buyItem(shoppingEvent.Id, {}))
        .rejects.toThrow("Missing required attribute 'ItemId'");
    });

    it("requires an ItemId starting with i-", async () => {
      const shoppingEvent = await core.startShopping();
      await expect(() => core.buyItem(shoppingEvent.Id, { ItemId: "x-000000000000" }))
        .rejects.toThrow('ItemId must start with "i-"');
    });

    it("requires a shopping event Id starting with se-", async () => {
      await expect(() => core.buyItem("x-0000", {}))
        .rejects.toThrow('Shopping event Id must start with "se-"');
    });

    it("requires a quantity", async () => {
      const shoppingEvent = await core.startShopping();
      await expect(() => core.buyItem(shoppingEvent.Id, { ItemId: 'i-xxxxxxx' }))
        .rejects.toThrow("Required attribute 'Quantity' is missing or is not an integer");
    });

    it("can update the amounts for a completed item", async () => {
      const shoppingEvent = await core.startShopping();
      const itemId = "i-111111111111"
      await core.buyItem(shoppingEvent.Id, { ItemId: itemId, ActualUnitPrice: 0.02, Quantity: 1 });
      const boughtItem = await core.buyItem(shoppingEvent.Id, { ItemId: itemId, ActualUnitPrice: 2.21, Quantity: 4 });
      expect(boughtItem).toEqual({
        Id: 'sei#' + shoppingEvent.Id + "#" + itemId,
        ItemId: itemId,
        ActualUnitPrice: 2.21,
        BoughtQuantity: 4
      });
    });
  });

  describe('completing a shopping event', () => {
    it('can complete a shopping event', async () => {
      const { Id } = await core.startShopping();
      await expect(core.stopShopping(Id)).resolves.toBeUndefined();
    });

    it("does not allow completing a non-existent shopping event", async () => {
      expect(() => core.stopShopping("se-nononononono"))
        .rejects.toThrow("Cannot stop Shopping Event se-nononononono");
    });

    it("updates the planned amounts for all completed items", async () => {
      const itemX = await core.createPlanItem({ Name: "X", PlannedQuantity: 5 });
      const itemY = await core.createPlanItem({ Name: "Y", PlannedQuantity: 2 });
      const itemZ = await core.createPlanItem({ Name: "Z", PlannedQuantity: 9 });
      const { Id } = await core.startShopping();
      await core.buyItem(Id, { ItemId: itemX.Id, Quantity: 3 });
      await core.buyItem(Id, { ItemId: itemY.Id, Quantity: 4 });
      await core.stopShopping(Id);
      const { all } = await core.getShoppingPlan();
      const actual = all.sort(sortByName).map(({ Name, PlannedQuantity }) => ({ Name, PlannedQuantity }));
      expect(actual).toEqual([
        { Name: "X", PlannedQuantity: 2 },
        { Name: "Y", PlannedQuantity: 0 },
        { Name: "Z", PlannedQuantity: 9 },
      ]);
    });

  });

  describe('describing one shopping event', () => {
    it('requires a shopping event description Id', async () => {
      await expect(() => core.getShoppingEvent("sx-000000000000-aaaaaa", true))
        .rejects.toThrow('The shopping event description ID must start with "se-"');
    });

    describe('description', () => {
      it('includes the event information', async () => {
        const { Id } = await core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
        const { description } = await core.getShoppingEvent(Id, true);
        expect(description).toEqual({
          Id,
          Store: "Costco",
          Status: "IN_PROGRESS",
          StartedAt: "0000-00-00T00:00:00.000Z",
          EstimatedTotal: 129.5,
        });
      });

      it('includes the status for completed events', async () => {
        const { Id } = await core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
        await core.stopShopping(Id);
        const { description } = await core.getShoppingEvent(Id, true);
        expect(description.Status).toEqual("COMPLETE");
      });

      it('includes the event information for historical events', async () => {
        const { Id } = await core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
        await core.stopShopping(Id);
        const { description } = await core.getShoppingEvent(Id, true);
        expect(description).toEqual({
          Id,
          Store: "Costco",
          Status: "COMPLETE",
          StartedAt: "0000-00-00T00:00:00.000Z",
          EstimatedTotal: 129.5,
        });
      });
    });

    describe('list', () => {
      it("includes every planned item from before and after the start of shopping", async () => {
        const { Id: idForApples } = await core.createPlanItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const { Id: idForBananas } = await core.createPlanItem({ Name: "Bananas (bunch)", PlannedQuantity: 1, UnitPriceEstimate: 2.01 });
        const { Id } = await core.startShopping();
        const { Id: idForCarrots } = await core.createPlanItem({ Name: "Carrots", PlannedQuantity: 3, UnitPriceEstimate: 1.00 });
        const { list } = await core.getShoppingEvent(Id, true);
        expect(list.sort(sortById)).toEqual([
          { Id: idForApples, Name: "Apples", RequiredQuantity: 2, BoughtQuantity: 0, UnitPriceEstimate: 0.60, Type: "OTHER" },
          { Id: idForBananas, Name: "Bananas (bunch)", RequiredQuantity: 1, BoughtQuantity: 0, UnitPriceEstimate: 2.01, Type: "OTHER" },
          { Id: idForCarrots, Name: "Carrots", RequiredQuantity: 3, BoughtQuantity: 0, UnitPriceEstimate: 1.00, Type: "OTHER" }
        ].sort(sortById));
      });

      it("includes information about whether each planned item is complete", async () => {
        const { Id: idForApples } = await core.createPlanItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const { Id: idForBananas } = await core.createPlanItem({ Name: "Bananas (bunch)", PlannedQuantity: 1, UnitPriceEstimate: 2.01 });
        const { Id: idForCarrots } = await core.createPlanItem({ Name: "Carrots", PlannedQuantity: 3, UnitPriceEstimate: 1.00 });
        const { Id } = await core.startShopping();
        await core.buyItem(Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        await core.buyItem(Id, { ItemId: idForCarrots, Quantity: 100, ActualUnitPrice: 2 });
        await core.buyItem(Id, { ItemId: idForCarrots, Quantity: 1, ActualUnitPrice: 2 });
        const { list } = await core.getShoppingEvent(Id, true);
        expect(list.sort(sortById)).toEqual([
          { Id: idForApples, Name: "Apples", RequiredQuantity: 2, BoughtQuantity: 2, UnitPriceEstimate: 0.60, ActualUnitPrice: 1.02, Type: "OTHER" },
          { Id: idForBananas, Name: "Bananas (bunch)", RequiredQuantity: 1, BoughtQuantity: 0, UnitPriceEstimate: 2.01, Type: "OTHER" },
          { Id: idForCarrots, Name: "Carrots", RequiredQuantity: 3, BoughtQuantity: 1, UnitPriceEstimate: 1.00, ActualUnitPrice: 2, Type: "OTHER" }
        ].sort(sortById));
      });

      it("excludes planned items when retrieving the historical list", async () => {
        const { Id: idForApples } = await core.createPlanItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const { Id: idForBananas } = await core.createPlanItem({ Name: "Bananas (bunch)", PlannedQuantity: 1, UnitPriceEstimate: 2.01 });
        const { Id: idForCarrots } = await core.createPlanItem({ Name: "Carrots", PlannedQuantity: 3, UnitPriceEstimate: 1.00, Type: "PRODUCE" });
        const { Id } = await core.startShopping();
        await core.buyItem(Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        await core.buyItem(Id, { ItemId: idForCarrots, Quantity: 100, ActualUnitPrice: 2 });
        await core.stopShopping(Id);
        const { list } = await core.getShoppingEvent(Id, true);
        expect(list.sort(sortById)).toEqual([
          { Id: idForApples, Name: "Apples", BoughtQuantity: 2, ActualUnitPrice: 1.02, Type: "OTHER" },
          { Id: idForCarrots, Name: "Carrots", BoughtQuantity: 100, ActualUnitPrice: 2, Type: "PRODUCE" },
        ].sort(sortById));
      });

      it("still includes the item details even if it is not part of the plan", async () => {
        const { Id: idForApples } = await core.createPlanItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60, Type: "DELI" });
        const { Id } = await core.startShopping();
        await core.buyItem(Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        await core.updateItem({ Id: idForApples, PlannedQuantity: 0 });
        const { list } = await core.getShoppingEvent(Id, true);
        expect(list).toEqual([
          { Id: idForApples, Name: "Apples", RequiredQuantity: 0, BoughtQuantity: 2, UnitPriceEstimate: 0.60, ActualUnitPrice: 1.02, Type: "DELI" }
        ]);
      });

      it("does not include any completed item info from other shopping events", async () => {
        const { Id: idForApples } = await core.createPlanItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const event1 = await core.startShopping();
        const event2 = await core.startShopping();
        await core.buyItem(event2.Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        const { list } = await core.getShoppingEvent(event1.Id, true);
        expect(list).toEqual([
          { Id: idForApples, Name: "Apples", RequiredQuantity: 2, BoughtQuantity: 0, UnitPriceEstimate: 0.60, Type: "OTHER" }
        ]);
      });
    });

    describe('statistics', () => {
      it.skip("includes totals for the cost of the whole shop and for what has been bought already", () => {});
    });
  });

  describe('listing all shopping events', () => {
    it("can list shopping events between certain dates", async () => {
      chronometer.getCurrentTimestamp.mockReturnValue("1990-01-01T00:00:00.000Z");
      await core.startShopping();
      chronometer.getCurrentTimestamp.mockReturnValue("1991-01-01T00:00:00.000Z");
      await core.startShopping();
      chronometer.getCurrentTimestamp.mockReturnValue("1992-01-01T00:00:00.000Z");
      await core.startShopping();
      chronometer.getCurrentTimestamp.mockReturnValue("1993-01-01T00:00:00.000Z");
      await core.startShopping();
      const startInclusive = new Date(Date.parse("1990-12-31T23:59:59.000Z"));
      const endInclusive = new Date(Date.parse("1992-12-31T23:59:59.000Z"));
      const shoppingEvents = await core.listShoppingEvents(startInclusive, endInclusive);
      expect(shoppingEvents.map(x => x.Id).join(","))
        .toMatch(/^se-199101010000-[a-z0-9]{8},se-199201010000-[a-z0-9]{8}$/);
    });

    it.skip("includes status, store, estimated total, and real total in the shopping events list", () => {});
    it.skip("includes the set of stores within the range (to use for auto-complete)", () => {});
  });
});
