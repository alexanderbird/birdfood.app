
export class Identifier {
  static shoppingEventId(isoDateString) {
    return this._generateTimestampId("se-", isoDateString);
  }

  static itemId() {
    return this._generateId("i-", 12);
  }

  static _generateId(prefix, length) {
    const randomPart = (
      Math.random().toString(36).slice(2)
      + Math.random().toString(36).slice(2)
    ).slice(0, length);
    return prefix + randomPart;
  }

  static _generateTimestampId(prefix, timestamp) {
    const timestampString = timestamp;
    const timestampPart = timestampString
      .replace(/\d\d\.\d\d\dZ/, '')
      .replace(/[^\d]/g, '');
    return [
      prefix,
      timestampPart,
      this._generateId("-", 8)
    ].join("");
  }
}
