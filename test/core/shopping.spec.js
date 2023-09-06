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

  it('generates a shopping ID from the created timestamp and a random part', () => {
    const shoppingEvent = core.startShopping();
    expect(shoppingEvent.Id).toMatch(/^s-[0-9]{12}-[a-z0-9]{6}$/);
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
      .flatMap(x => x.Id.replace("s-", "").replace(/-/, '').split(""))
      .sort();
    const uniqueCharacters = Array.from(new Set(allIdCharacters)).join("");
    expect(uniqueCharacters).toEqual("0123456789abcdefghijklmnopqrstuvwxyz")
  });

  it("does not allow completing a non-existent shopping event", () => {
    expect(() => core.stopShopping("s-nononononono"))
      .toThrow("Cannot stop Shopping Event s-nononononono");
  });

  it('can complete a shopping event', () => {
    const { Id } = core.startShopping();
    expect(() => core.stopShopping(Id))
      .not.toThrow();
  });

  it('stores the shopping event in the database', () => {
    const otherCore = new Core(data);
    const { Id: shoppingEventId } = core.startShopping();
    expect(() => otherCore.stopShopping(shoppingEventId))
      .not.toThrow();
  });

  // includes status, store, estimated total, and real total when getting a single shopping event

  // can list shopping events between certain dates
  // includes status, store, estimated total, and real total in the shopping events list
  // can list includes only shopping events within range

  
  // can complete items for a shopping event
  // does not allow completing items for non-existent shopping events
  // does not mix up completed items between shopping events
  // cannot complete items for a complete shopping event
  //
  // can get shopping event details which includes the merge of all items in the shopping list and all the completed events in the shopping event
});
