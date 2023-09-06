import { StaticData } from '../../src/data/static';
import { describe, it, expect, beforeEach } from 'vitest';

describe(StaticData, () => {
  it('returns canned data', () => {
    const data = new StaticData();
    expect(data.listItems("i-")).toHaveLength(38);
  });
});
