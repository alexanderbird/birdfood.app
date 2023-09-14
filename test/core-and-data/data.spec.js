import { testDataSource } from './testDataSource';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('data', () => {
  let data;

  beforeEach(() => {
    data = testDataSource();
  });

  describe('createItem', () => {
    it('refuses to overwrite an existing item', async () => {
      await data.createItem({ Id: 'TheFirst' });
      await expect(data.createItem({ Id: 'TheFirst' }))
        .rejects.toThrow();
    });
  });
});
