import { StaticData } from '../../src/data/static';
import { Core } from '../../src/core';
import { describe, it, expect } from 'vitest';

describe('core shopping APIs', () => {
  it('generates a reasonable ID when you start shopping', () => {
    const core = new Core(new StaticData());
    const shoppingEvent = core.startShopping();
    expect(shoppingEvent.Id).toMatch(/^s-[a-z0-9]{12}$/);
  });

  it.skip('generates a new ID each time you start shopping', () => {
    const soMany = 10000;
    const allIds = new Array(soMany)
      .map(() => core.startShopping())
      .map(x => x.Id);
    expect(new Set(allIds).size).toEqual(soMany);
  });

  // can complete items for a shopping event
  // does not allow completing items for non-existent shopping events
  // can list shopping events with status
  // can complete a shopping event
  // cannot complete items for a complete shopping event
  // can get a shopping event list which includes the merge of all items in the shopping list and all the completed events in the shopping event
});
