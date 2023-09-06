import { Chronometer, SteppingChronometer } from '../../src/core/Chronometer';
import { describe, it, expect, beforeEach } from 'vitest';
describe(Chronometer, () => {
  it('produces a date in ISO format', () => {
    const actual = new Chronometer().getCurrentTimestamp();
    expect(actual).toMatch(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ/);
  });
});

describe(SteppingChronometer, () => {
  it('produces a date in ISO format', () => {
    const actual = new SteppingChronometer().getCurrentTimestamp();
    expect(actual).toMatch(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ/);
  });

  it('returns a slightly later date every time', () => {
    const chronometer = new SteppingChronometer();
    const actual = [
      chronometer.getCurrentTimestamp(),
      chronometer.getCurrentTimestamp(),
      chronometer.getCurrentTimestamp(),
      chronometer.getCurrentTimestamp(),
    ];
    expect(actual).toEqual([
      "0000-00-00T00:00:00.000Z",
      "0000-00-00T00:00:00.001Z",
      "0000-00-00T00:00:00.002Z",
      "0000-00-00T00:00:00.003Z",
    ]);
  });
});
