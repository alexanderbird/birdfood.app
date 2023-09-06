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
    // does not allow overriding ID or status

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
    it.skip("can complete items for a shopping event", () => {});
    it.skip("does not allow completing items for non-existent shopping events", () => {});
    it.skip("cannot complete items for a complete shopping event", () => {});
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

    // updates the planned amounts for all completed items

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

    it.skip("includes every planned item", () => {});
    it.skip("includes information about whether each planned item is complete", () => {});
    it.skip("does not include any completed item info from other shopping events", () => {});
  });

  describe('listing all shopping events', () => {
    it.skip("can list shopping events between certain dates", () => {});
    it.skip("includes status, store, estimated total, and real total in the shopping events list", () => {});
    it.skip("can list includes only shopping events within range", () => {});
    it.skip("includes the set of stores within the range (to use for auto-complete)", () => {});
  });
});
