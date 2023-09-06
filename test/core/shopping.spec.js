import { StaticData } from '../../src/data/static';
import { Core } from '../../src/core';
import { describe, it, expect } from 'vitest';

describe('core shopping APIs', () => {
  it('generates a reasonable ID when you start shopping', () => {
    const core = new Core(new StaticData());
    const shoppingEvent = core.startShopping();
    expect(shoppingEvent.Id).toMatch(/^s-[a-z0-9]{12}$/);
  });

  it('generates a new ID each time you start shopping', () => {
    const core = new Core(new StaticData());
    const soMany = 10000;
    const allIds = Array(soMany).fill()
      .map(() => core.startShopping())
      .map(x => x.Id);
    expect(new Set(allIds).size).toEqual(soMany);
  });

  it('uses all numbers and letters in the ID generation', () => {
    const core = new Core(new StaticData());
    const soMany = 10000;
    const allIdCharacters = Array(soMany).fill()
      .map(() => core.startShopping())
      .flatMap(x => x.Id.replace("s-", "").split(""))
      .sort();
    const uniqueCharacters = Array.from(new Set(allIdCharacters)).join("");
    expect(uniqueCharacters).toEqual("0123456789abcdefghijklmnopqrstuvwxyz")
  });

  it("does not allow completing a non-existent shopping event", () => {
    const core = new Core(new StaticData());
   expect(() => core.stopShopping("s-nononononono"))
      .toThrow("Cannot stop Shopping Event s-nononononono");
  });

  // can list shopping events with status
  // can complete a shopping event
  
  // can complete items for a shopping event
  // does not allow completing items for non-existent shopping events
  // does not mix up completed items between shopping events
  // cannot complete items for a complete shopping event
  // can get a shopping event list which includes the merge of all items in the shopping list and all the completed events in the shopping event
});
