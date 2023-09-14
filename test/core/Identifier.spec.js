import { Core } from '../../src/core';
import { SteppingChronometer } from '../../src/core/Chronometer';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmptyStaticData } from '../../src/data/static';

describe('Identifier', () => {
  let core;
  let chronometer;

  beforeEach(() => {
    const data = new EmptyStaticData();
    chronometer = { getCurrentTimestamp: vi.fn() };
    chronometer.getCurrentTimestamp.mockReturnValue("0000-00-00T00:00:00.000Z");
    core = new Core(data, chronometer);
  });

  describe('adding an item during planning', () => {
    it("generates an Id on create", async () => {
      const item = await core.createItem({ Name: "jam" });
      expect(item.Id).toMatch(/^i-[a-z0-9]{12}$/);
    });

    it('generates a unique Id each time you create', async () => {
      const soMany = 10000;
      const allIds = (await Promise.all(Array(soMany).fill()
        .map(() => core.createItem({ Name: "Pears" }))))
        .map(x => x.Id);
      expect(new Set(allIds).size).toEqual(soMany);
    });

    it('uses all numbers and letters in the ID generation', async () => {
      const soMany = 10000;
      const allIdCharacters = (await Promise.all(Array(soMany).fill()
        .map(() => core.createItem({ Name: "Pears" }))))
        .flatMap(x => x.Id.replace("i-", "").split(""))
        .sort();
      const uniqueCharacters = Array.from(new Set(allIdCharacters)).join("");
      expect(uniqueCharacters).toEqual("0123456789abcdefghijklmnopqrstuvwxyz")
    });
  });

  describe('starting a shop', () => {
    it('generates a shopping ID from the created timestamp and a random part', async () => {
      const shoppingEvent = await core.startShopping();
      expect(shoppingEvent.Id).toMatch(/^se-[0-9]{12}-[a-z0-9]{8}$/);
    });

    it('generates a new ID each time you start shopping (even if the timestamp is the same)', async () => {
      chronometer.getCurrentTimestamp.mockReturnValue("1999-12-31T18:45:26.184Z");
      const soMany = 10000;
      const allIds = (await Promise.all(Array(soMany).fill()
        .map(() => core.startShopping())))
        .map(x => x.Id);
      expect(new Set(allIds).size).toEqual(soMany);
    });

    it('uses all numbers and letters in the ID generation', async () => {
      const soMany = 10000;
      const allIdCharacters = (await Promise.all(Array(soMany).fill()
        .map(() => core.startShopping())))
        .flatMap(x => x.Id.replace("se-", "").replace(/-/, '').split(""))
        .sort();
      const uniqueCharacters = Array.from(new Set(allIdCharacters)).join("");
      expect(uniqueCharacters).toEqual("0123456789abcdefghijklmnopqrstuvwxyz")
    });
  });
});

