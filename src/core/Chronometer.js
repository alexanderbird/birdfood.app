export class Chronometer {
  getCurrentTimestamp() {
    return new Date(Date.now()).toISOString();
  }
}

/**
 * Always returns a fixed date. Useful for testing.
 */
export class SteppingChronometer {
  constructor() {
    this.step = 0;
  }

  getCurrentTimestamp() {
    const milliseconds = this.step.toString().padStart(3, "0");
    this.step += 1;
    return `0000-00-00T00:00:00.${milliseconds}Z`;
  }
}
