/* eslint-disable */
// Disabled linting since this is a placeholder file with lots of unused params
// After it's implemented, we can re-enable linting
export class DynamoDbData {
  constructor() {
  }

  updateItem({ Id, ...attributes }) {
    console.warn('Not Implemented');
    return Promise.resolve();
  }

  getItem(id) {
    console.warn('Not Implemented');
    return Promise.resolve();
  }

  batchGetItems(ids) {
    console.warn('Not Implemented');
    return Promise.resolve([]);
  }

  putItem(attributes) {
    console.warn('Not Implemented');
    return Promise.resolve();
  }

  createItem(attributes) {
    console.warn('Not Implemented');
    return Promise.resolve();
  }

  addItemValue(id, attribute, addend) {
    console.warn('Not Implemented');
    return Promise.resolve();
  }

  batchUpdateItems(itemChanges) {
    console.warn('Not Implemented');
    return Promise.resolve();
  }

  listItems(prefix) {
    console.warn('Not Implemented');
    return Promise.resolve([]);
  }

  listItemsBetween(startInclusive, endInclusive) {
    console.warn('Not Implemented');
    return Promise.resolve([]);
  }
}
