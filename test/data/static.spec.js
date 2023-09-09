import { StaticData } from '../../src/data/static';
import { describe, it, expect, beforeEach } from 'vitest';

describe(StaticData, () => {
  it('returns canned data', async () => {
    const data = new StaticData();
    expect(await data.listItems("i-")).toHaveLength(38);
  });
});
