import { StaticData } from '../../src/data/static';
import { Core } from '../../src/core';
import { describe, it, expect } from 'vitest';

describe('core shopping APIs', () => {
  it('generates a reasonable ID when you start shopping', () => {
    const core = new Core(new StaticData());
    const shopping = core.startShopping();
    expect(shopping.Id).toMatch(/^s-[a-z0-9]{12}$/);
  });

  it.skip('generates a new ID each time you start shopping', () => {
    const soMany = 10000;
    const allIds = new Array(soMany)
      .map(() => core.startShopping())
      .map(x => x.Id);
    expect(new Set(allIds).size).toEqual(soMany);
  });
});
