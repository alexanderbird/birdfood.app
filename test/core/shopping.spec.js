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
    it.skip("does not allow overriding ID or status", () => {});

    it('generates a shopping ID from the created timestamp and a random part', () => {
      const shoppingEvent = core.startShopping();
      expect(shoppingEvent.Id).toMatch(/^s-[0-9]{12}-[a-z0-9]{6}#description$/);
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
        .flatMap(x => x.Id.replace("s-", "").replace(/-/, '').replace(/#description$/, '').split(""))
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
  });

  describe('completing items during a shopping event', () => {
    it("can complete items for a shopping event", () => {
      const shoppingEvent = core.startShopping();
      const itemId = "i-111111111111"
      const boughtItem = core.buyItem(shoppingEvent.Id, { ItemId: itemId, ActualUnitPrice: 2.21, Quantity: 4 });
      expect(boughtItem).toEqual({
        Id: shoppingEvent.Id.replace(/#description$/, '') + "#" + itemId,
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

    it("requires a shopping event Id starting with s-", () => {
      expect(() => core.buyItem("x-0000", {}))
        .toThrow('Shopping event Id must start with "s-"');
    });

    it("does not allow completing items for non-existent shopping events", () => {
      expect(() => core.buyItem("s-nope", { ItemId: "i-whatever" }))
        .toThrow('No such shopping event "s-nope#description"');
    });

    it("accepts a shopping event Id that does not end in #description", () => {
      const shoppingEvent = core.startShopping();
      const idWithoutHashDescription = shoppingEvent.Id.replace(/#description$/, '');
      expect(() => core.buyItem(idWithoutHashDescription, { ItemId: "i-whatever" }))
        .not.toThrow();
    });

    it("cannot complete items for a complete shopping event", () => {
      const shoppingEvent = core.startShopping();
      core.stopShopping(shoppingEvent.Id);
      expect(() => core.buyItem(shoppingEvent.Id, { ItemId: "i-000000000000" }))
        .toThrow('Cannot buy an item for a shopping event with status "COMPLETE"');
    });
  });

  describe('completing a shopping event', () => {
    it('can complete a shopping event', () => {
      const { Id } = core.startShopping();
      expect(() => core.stopShopping(Id))
        .not.toThrow();
    });

    it("does not allow completing a non-existent shopping event", () => {
      expect(() => core.stopShopping("s-nononononono"))
        .toThrow("Cannot stop Shopping Event s-nononononono");
    });

    it.skip("updates the planned amounts for all completed items", () => {});

  });

  describe('describing one shopping event', () => {
    it('requires a shopping event description Id', () => {
      expect(() => core.getShoppingEvent("s-000000000000-aaaaaa#descriptiox"))
        .toThrow('The shopping event description ID must start with "s-" and end with "#description"');
    });

    it('includes the event description', () => {
      const { Id } = core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
      const { description } = core.getShoppingEvent(Id);
      expect(description).toEqual({
        Id,
        Store: "Costco",
        Status: "IN_PROGRESS",
        EstimatedTotal: 129.5,
      });
    });

    it('includes the status for completed events', () => {
      const { Id } = core.startShopping({ Store: "Costco", EstimatedTotal: 129.5 });
      core.stopShopping(Id);
      const { description } = core.getShoppingEvent(Id);
      expect(description.Status).toEqual("COMPLETE");
    });

    it("includes every planned item from before and after the start of shopping", () => {
      const { Id: idForApples } = core.createItem({ Name: "Apples", PlannedQuantity: 2, UnitPriceEstimate: 0.60 });
      const { Id: idForBananas } = core.createItem({ Name: "Bananas (bunch)", PlannedQuantity: 1, UnitPriceEstimate: 2.01 });
      const { Id } = core.startShopping();
      const { Id: idForCarrots } = core.createItem({ Name: "Carrots", PlannedQuantity: 3, UnitPriceEstimate: 1.00 });
      const { list } = core.getShoppingEvent(Id);
      expect(list).toEqual([
        { Id: idForApples, Name: "Apples", RequiredQuantity: 2, BoughtQuantity: 0, UnitPriceEstimate: 0.60 },
        { Id: idForBananas, Name: "Bananas (bunch)", RequiredQuantity: 1, BoughtQuantity: 0, UnitPriceEstimate: 2.01 },
        { Id: idForCarrots, Name: "Carrots", RequiredQuantity: 3, BoughtQuantity: 0, UnitPriceEstimate: 1.00 }
      ]);
    });

    it.skip("includes information about whether each planned item is complete", () => {});
    it.skip("includes totals for the cost of the whole shop and for what has been bought already", () => {});
    it.skip("does not include any completed item info from other shopping events", () => {});
    it.skip("still includes the item details even if it is not part of the plan", () => {});
  });

  describe('listing all shopping events', () => {
    it.skip("can list shopping events between certain dates", () => {});
    it.skip("includes status, store, estimated total, and real total in the shopping events list", () => {});
    it.skip("can list includes only shopping events within range", () => {});
    it.skip("includes the set of stores within the range (to use for auto-complete)", () => {});
  });
});
