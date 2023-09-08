import { SteppingChronometer } from '../../src/core/Chronometer';
import { EmptyStaticData } from '../../src/data/static';
import { Core } from '../../src/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('core shopping APIs', () => {
  let core;
  let data;
  let chronometer;
  beforeEach(() => {
    chronometer = { getCurrentTimestamp: vi.fn() };
    chronometer.getCurrentTimestamp.mockReturnValue("0000-00-00T00:00:00.000Z");
    data = new EmptyStaticData();
    core = new Core(data, chronometer);
  });

  describe('starting a shop', () => {
    it('generates a shopping ID from the created timestamp and a random part', () => {
      const shoppingEvent = core.startShopping();
      expect(shoppingEvent.Id).toMatch(/^se-[0-9]{12}-[a-z0-9]{8}$/);
    });

    it('generates a new ID each time you start shopping (even if the timestamp is the same)', () => {
      chronometer.getCurrentTimestamp.mockReturnValue("1999-12-31T18:45:26.184Z");
      const soMany = 10000;
      const allIds = Array(soMany).fill()
        .map(() => core.startShopping())
        .map(x => x.Id);
      expect(new Set(allIds).size).toEqual(soMany);
    });

    it('uses all numbers and letters in the ID generation', () => {
      const soMany = 10000;
      const allIdCharacters = Array(soMany).fill()
        .map(() => core.startShopping())
        .flatMap(x => x.Id.replace("se-", "").replace(/-/, '').split(""))
        .sort();
      const uniqueCharacters = Array.from(new Set(allIdCharacters)).join("");
      expect(uniqueCharacters).toEqual("0123456789abcdefghijklmnopqrstuvwxyz")
    });

    it('persists the shopping event in the database', () => {
      const otherCore = new Core(data);
      const { Id: shoppingEventId } = core.startShopping();
      expect(() => otherCore.stopShopping(shoppingEventId))
        .not.toThrow();
    });

    it("does not allow overriding ID or status", () => {
      chronometer.getCurrentTimestamp.mockReturnValue("1999-12-31T18:45:26.184Z");
      const shoppingEvent = core.startShopping({ Id: "1111", Status: "NOPE" });
      expect(shoppingEvent.Status).toEqual("IN_PROGRESS");
      expect(shoppingEvent.Id).toMatch(/^se-199912311845-[a-z0-9]{8}$/);
    });
  });

  describe('completing items during a shopping event', () => {
    it("can complete items for a shopping event", () => {
      const shoppingEvent = core.startShopping();
      const itemId = "i-111111111111"
      const boughtItem = core.buyItem(shoppingEvent.Id, { ItemId: itemId, ActualUnitPrice: 2.21, Quantity: 4 });
      expect(boughtItem).toEqual({
        Id: 'sei#' + shoppingEvent.Id + "#" + itemId,
        ItemId: itemId,
        ActualUnitPrice: 2.21,
        Quantity: 4
      });
    });

    it("requires an ItemId", () => {
      const shoppingEvent = core.startShopping();
      expect(() => core.buyItem(shoppingEvent.Id, {}))
        .toThrow("Missing required attribute 'ItemId'");
    });

    it("requires an ItemId starting with i-", () => {
      const shoppingEvent = core.startShopping();
      expect(() => core.buyItem(shoppingEvent.Id, { ItemId: "x-000000000000" }))
        .toThrow('ItemId must start with "i-"');
    });

    it("requires a shopping event Id starting with se-", () => {
      expect(() => core.buyItem("x-0000", {}))
        .toThrow('Shopping event Id must start with "se-"');
    });

    it("does not allow completing items for non-existent shopping events", () => {
      expect(() => core.buyItem("se-nope", { ItemId: "i-whatever", Quantity: 1 }))
        .toThrow('No such shopping event "se-nope"');
    });

    it("cannot complete items for a complete shopping event", () => {
      const shoppingEvent = core.startShopping();
      core.stopShopping(shoppingEvent.Id);
      expect(() => core.buyItem(shoppingEvent.Id, { ItemId: "i-000000000000", Quantity: 1 }))
        .toThrow('Cannot buy an item for a shopping event with status "COMPLETE"');
    });

    it("requires a quantity", () => {
      const shoppingEvent = core.startShopping();
      expect(() => core.buyItem(shoppingEvent.Id, { ItemId: 'i-xxxxxxx' }))
        .toThrow("Required attribute 'Quantity' is missing or is not an integer");
    });

    it("can update the amounts for a completed item", () => {
      const shoppingEvent = core.startShopping();
      const itemId = "i-111111111111"
      core.buyItem(shoppingEvent.Id, { ItemId: itemId, ActualUnitPrice: 0.02, Quantity: 1 });
      const boughtItem = core.buyItem(shoppingEvent.Id, { ItemId: itemId, ActualUnitPrice: 2.21, Quantity: 4 });
      expect(boughtItem).toEqual({
        Id: 'sei#' + shoppingEvent.Id + "#" + itemId,
        ItemId: itemId,
        ActualUnitPrice: 2.21,
        Quantity: 4
      });
    });
  });

  describe('completing a shopping event', () => {
    it('can complete a shopping event', () => {
      const { Id } = core.startShopping();
      expect(() => core.stopShopping(Id))
        .not.toThrow();
    });

    it("does not allow completing a non-existent shopping event", () => {
      expect(() => core.stopShopping("se-nononononono"))
        .toThrow("Cannot stop Shopping Event se-nononononono");
    });

    it("updates the planned amounts for all completed items", () => {
      const itemX = core.createItem({ Name: "X", PlannedQuantity: 5 });
      const itemY = core.createItem({ Name: "Y", PlannedQuantity: 2 });
      const itemZ = core.createItem({ Name: "Z", PlannedQuantity: 9 });
      const { Id } = core.startShopping();
      core.buyItem(Id, { ItemId: itemX.Id, Quantity: 3 });
      core.buyItem(Id, { ItemId: itemY.Id, Quantity: 4 });
      core.stopShopping(Id);
      const { all } = core.getShoppingPlan();
      const actual = all.map(({ Name, PlannedQuantity }) => ({ Name, PlannedQuantity }));
      expect(actual).toEqual([
        { Name: "X", PlannedQuantity: 2 },
        { Name: "Y", PlannedQuantity: 0 },
        { Name: "Z", PlannedQuantity: 9 },
      ]);
    });

  });

  describe('describing one shopping event', () => {
    it('requires a shopping event description Id', () => {
      expect(() => core.getShoppingEvent("sx-000000000000-aaaaaa"))
        .toThrow('The shopping event description ID must start with "se-"');
    });

    describe('description', () => {
      it('includes the event information', () => {
        const { Id } = core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
        const { description } = core.getShoppingEvent(Id);
        expect(description).toEqual({
          Id,
          Store: "Costco",
          Status: "IN_PROGRESS",
          StartedAt: "0000-00-00T00:00:00.000Z",
          EstimatedTotal: 129.5,
        });
      });

      it('includes the status for completed events', () => {
        const { Id } = core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
        core.stopShopping(Id);
        const { description } = core.getShoppingEvent(Id);
        expect(description.Status).toEqual("COMPLETE");
      });

      it('includes the event information for historical events', () => {
        const { Id } = core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
        core.stopShopping(Id);
        const { description } = core.getShoppingEvent(Id);
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
      it("includes every planned item from before and after the start of shopping", () => {
        const { Id: idForApples } = core.createItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const { Id: idForBananas } = core.createItem({ Name: "Bananas (bunch)", PlannedQuantity: 1, UnitPriceEstimate: 2.01 });
        const { Id } = core.startShopping();
        const { Id: idForCarrots } = core.createItem({ Name: "Carrots", PlannedQuantity: 3, UnitPriceEstimate: 1.00 });
        const { list } = core.getShoppingEvent(Id);
        expect(list).toEqual([
          { Id: idForApples, Name: "Apples", RequiredQuantity: 2, BoughtQuantity: 0, UnitPriceEstimate: 0.60, Type: "OTHER" },
          { Id: idForBananas, Name: "Bananas (bunch)", RequiredQuantity: 1, BoughtQuantity: 0, UnitPriceEstimate: 2.01, Type: "OTHER" },
          { Id: idForCarrots, Name: "Carrots", RequiredQuantity: 3, BoughtQuantity: 0, UnitPriceEstimate: 1.00, Type: "OTHER" }
        ]);
      });

      it("includes information about whether each planned item is complete", () => {
        const { Id: idForApples } = core.createItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const { Id: idForBananas } = core.createItem({ Name: "Bananas (bunch)", PlannedQuantity: 1, UnitPriceEstimate: 2.01 });
        const { Id: idForCarrots } = core.createItem({ Name: "Carrots", PlannedQuantity: 3, UnitPriceEstimate: 1.00 });
        const { Id } = core.startShopping();
        core.buyItem(Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        core.buyItem(Id, { ItemId: idForCarrots, Quantity: 100, ActualUnitPrice: 2 });
        core.buyItem(Id, { ItemId: idForCarrots, Quantity: 1, ActualUnitPrice: 2 });
        const { list } = core.getShoppingEvent(Id);
        expect(list).toEqual([
          { Id: idForApples, Name: "Apples", RequiredQuantity: 2, BoughtQuantity: 2, UnitPriceEstimate: 0.60, ActualUnitPrice: 1.02, Type: "OTHER" },
          { Id: idForBananas, Name: "Bananas (bunch)", RequiredQuantity: 1, BoughtQuantity: 0, UnitPriceEstimate: 2.01, Type: "OTHER" },
          { Id: idForCarrots, Name: "Carrots", RequiredQuantity: 3, BoughtQuantity: 1, UnitPriceEstimate: 1.00, ActualUnitPrice: 2, Type: "OTHER" }
        ]);
      });

      it("excludes planned items when retrieving the historical list", () => {
        const { Id: idForApples } = core.createItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const { Id: idForBananas } = core.createItem({ Name: "Bananas (bunch)", PlannedQuantity: 1, UnitPriceEstimate: 2.01 });
        const { Id: idForCarrots } = core.createItem({ Name: "Carrots", PlannedQuantity: 3, UnitPriceEstimate: 1.00, Type: "PRODUCE" });
        const { Id } = core.startShopping();
        core.buyItem(Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        core.buyItem(Id, { ItemId: idForCarrots, Quantity: 100, ActualUnitPrice: 2 });
        core.stopShopping(Id);
        const { list } = core.getShoppingEvent(Id);
        expect(list).toEqual([
          { Id: idForApples, Name: "Apples", BoughtQuantity: 2, ActualUnitPrice: 1.02, Type: "OTHER" },
          { Id: idForCarrots, Name: "Carrots", BoughtQuantity: 100, ActualUnitPrice: 2, Type: "PRODUCE" },
        ]);
      });

      it("still includes the item details even if it is not part of the plan", () => {
        const { Id: idForApples } = core.createItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60, Type: "DELI" });
        const { Id } = core.startShopping();
        core.buyItem(Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        core.updateItem({ Id: idForApples, PlannedQuantity: 0 });
        const { list } = core.getShoppingEvent(Id);
        expect(list).toEqual([
          { Id: idForApples, Name: "Apples", RequiredQuantity: 0, BoughtQuantity: 2, UnitPriceEstimate: 0.60, ActualUnitPrice: 1.02, Type: "DELI" }
        ]);
      });

      it("does not include any completed item info from other shopping events", () => {
        const { Id: idForApples } = core.createItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
        const event1 = core.startShopping();
        const event2 = core.startShopping();
        core.buyItem(event2.Id, { ItemId: idForApples, Quantity: 2, ActualUnitPrice: 1.02 });
        const { list } = core.getShoppingEvent(event1.Id);
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
    it("can list shopping events between certain dates", () => {
      chronometer.getCurrentTimestamp.mockReturnValue("1990-01-01T00:00:00.000Z");
      core.startShopping();
      chronometer.getCurrentTimestamp.mockReturnValue("1991-01-01T00:00:00.000Z");
      core.startShopping();
      chronometer.getCurrentTimestamp.mockReturnValue("1992-01-01T00:00:00.000Z");
      core.startShopping();
      chronometer.getCurrentTimestamp.mockReturnValue("1993-01-01T00:00:00.000Z");
      core.startShopping();
      const startInclusive = new Date(Date.parse("1990-12-31T23:59:59.000Z"));
      const endInclusive = new Date(Date.parse("1992-12-31T23:59:59.000Z"));
      const shoppingEvents = core.listShoppingEvents(startInclusive, endInclusive);
      expect(shoppingEvents.map(x => x.Id).join(","))
        .toMatch(/^se-199101010000-[a-z0-9]{8},se-199201010000-[a-z0-9]{8}$/);
    });

    it.skip("includes status, store, estimated total, and real total in the shopping events list", () => {});
    it.skip("includes the set of stores within the range (to use for auto-complete)", () => {});
  });
});
