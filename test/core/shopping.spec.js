import { EmptyStaticData } from '../../src/data/static';
import { Core } from '../../src/core';
import { describe, it, expect } from 'vitest';

describe('core shopping APIs', () => {
  it('generates a reasonable ID when you start shopping', () => {
    const core = new Core(new EmptyStaticData());
    const shoppingEvent = core.startShopping();
    expect(shoppingEvent.Id).toMatch(/^s-[a-z0-9]{12}$/);
  });

  it('generates a new ID each time you start shopping', () => {
    const core = new Core(new EmptyStaticData());
    const soMany = 10000;
    const allIds = Array(soMany).fill()
      .map(() => core.startShopping())
      .map(x => x.Id);
    expect(new Set(allIds).size).toEqual(soMany);
  });

  it('uses all numbers and letters in the ID generation', () => {
    const core = new Core(new EmptyStaticData());
    const soMany = 10000;
    const allIdCharacters = Array(soMany).fill()
      .map(() => core.startShopping())
      .flatMap(x => x.Id.replace("s-", "").split(""))
      .sort();
    const uniqueCharacters = Array.from(new Set(allIdCharacters)).join("");
    expect(uniqueCharacters).toEqual("0123456789abcdefghijklmnopqrstuvwxyz")
  });

  it("does not allow completing a non-existent shopping event", () => {
    const core = new Core(new EmptyStaticData());
    expect(() => core.stopShopping("s-nononononono"))
      .toThrow("Cannot stop Shopping Event s-nononononono");
  });

  it('can complete a shopping event', () => {
    const core = new Core(new EmptyStaticData());
    const { Id } = core.startShopping();
    expect(() => core.stopShopping(Id))
      .not.toThrow();
  });

  it('stores the shopping event in the database', () => {
    const data = new EmptyStaticData();
    const core1 = new Core(data);
    const core2 = new Core(data);
    const { Id: shoppingEventId } = core1.startShopping();
    expect(() => core2.stopShopping(shoppingEventId))
      .not.toThrow();
  });

  // can list shopping events with status
  
  // can complete items for a shopping event
  // does not allow completing items for non-existent shopping events
  // does not mix up completed items between shopping events
  // cannot complete items for a complete shopping event
  // can get a shopping event list which includes the merge of all items in the shopping list and all the completed events in the shopping event
});
