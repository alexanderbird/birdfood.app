import { Chronometer } from './Chronometer';

export class Core {
  constructor(data, chronometer) {
    this.chronometer = chronometer || new Chronometer();
    this.data = data;
    this.shoppingListConsumers = {};
  }

  startShopping(attributes) {
    const shoppingEvent = {
      ...attributes,
      Id: this._generateTimestampId("se-"),
      StartedAt: this._getCurrentTimestamp(),
      Status: "IN_PROGRESS",
    };
    this.shoppingEvent = shoppingEvent;
    this.data.createItem(shoppingEvent);
    return shoppingEvent;
  }

  buyItem(shoppingEventId, attributes) {
    const itemId = attributes.ItemId;
    if (!shoppingEventId.startsWith("se-")) {
      throw new Error('Shopping event Id must start with "se-"');
    }
    if (!itemId) {
      throw new Error("Missing required attribute 'ItemId'");
    }
    if (!itemId.startsWith("i-")) {
      throw new Error('ItemId must start with "i-"');
    }
    if (!attributes.Quantity) {
      throw new Error("Missing required attribute 'Quantity'");
    }
    const shoppingEvent = this.data.getItem(shoppingEventId);
    if (!shoppingEvent) {
      throw new Error(`No such shopping event "${shoppingEventId}"`);
    }
    if (shoppingEvent.Status !== "IN_PROGRESS") {
      throw new Error(`Cannot buy an item for a shopping event with status "${shoppingEvent.Status}"`);
    }
    const boughtItem = {
      Id: 'sei#' + shoppingEventId + '#' + itemId,
      ...attributes
    }
    this.data.createItem(boughtItem);
    return boughtItem;
  }

  _assembleItemForShoppingEvent(plannedItem, completedItem) {
    return ({
      Id: plannedItem.Id,
      Name: plannedItem.Name,
      RequiredQuantity: plannedItem.PlannedQuantity,
      UnitPriceEstimate: plannedItem.UnitPriceEstimate,
      BoughtQuantity: completedItem?.Quantity || 0,
      ActualUnitPrice: completedItem?.ActualUnitPrice
    });
  }

  getShoppingEvent(id) {
    if (!id.startsWith("se-")) {
      throw new Error('The shopping event description ID must start with "se-"');
    }
    const description = this.data.getItem(id);
    if (!description) {
      const error = new Error(`Shopping Event not found "${id}"`);
      error.code = "ResourceNotFound";
      throw error;
    }
    const completedItems = Object.fromEntries(
      this.data.listItems('sei#' + id + '#i-')
        .map(x => [x.Id.replace(/^sei#se-[0-9a-z-]+#/, ''), x]));
    const completedItemIds = new Set(Object.keys(completedItems));
    const processedItemIds = new Set();
    const listA = this.data.listItems("i-")
      .filter(x => x.PlannedQuantity)
      .map(x => { processedItemIds.add(x.Id); return x; })
      .map(plannedItem => this._assembleItemForShoppingEvent(plannedItem, completedItems[plannedItem.Id]));

    const itemsThatHaveBeenRemovedFromThePlannedListAfterMarkingThemAsComplete =
      Array.from(completedItemIds).filter(id => !processedItemIds.has(id));
    const listB = this.data.batchGetItems(itemsThatHaveBeenRemovedFromThePlannedListAfterMarkingThemAsComplete)
      .map(plannedItem => this._assembleItemForShoppingEvent(plannedItem, completedItems[plannedItem.Id]))
    const list = listA.concat(listB);
    return {
      description,
      list
    }
  }

  listShoppingEvents(startDate, endDate) {
    const start = this._generateTimestampId("se-", startDate.toISOString());
    const end = this._generateTimestampId("se-", endDate.toISOString());
    return this.data.listItemsBetween(start, end);
  }

  stopShopping(id) {
    const shoppingEvent = this.data.getItem(id);
    if (!shoppingEvent) {
      throw new Error(`Cannot stop Shopping Event ${id}`);
    }
    const shoppingEventItemsPrefix = "sei#" + id + "#i-";
    const completedItems = this.data.listItems(shoppingEventItemsPrefix);
    const currentPlannedQuantities = Object.fromEntries(
      this.data.batchGetItems(completedItems.map(x => x.ItemId))
        .map(x => [x.Id, x.PlannedQuantity]));
    const updates = completedItems
      .map(completedItem => ({
        id: completedItem.ItemId,
        updates: [{
          attributeName: "PlannedQuantity",
          value: Math.max(0,
            currentPlannedQuantities[completedItem.ItemId] - completedItem.Quantity)
        }]
      }))
      .concat({ id, updates: [{ attributeName: "Status", value: "COMPLETE" }] });
    this.data.batchUpdateItems(updates);
  }

  offShoppingListUpdate(key) {
    delete this.shoppingListConsumers[key];
  }

  onShoppingListUpdate(key, consumeShoppingList) {
    this.shoppingListConsumers[key] = { key, consumeShoppingList };
  }

  addRecurringItems() {
    const toAdd = this.getShoppingPlan().recurringItemsToAdd;
    const currentTimestamp = this._getCurrentTimestamp();
    this.data.batchUpdateItems(toAdd.map(item => ({
      id: item.Id,
      updates: [
        {
          value: currentTimestamp,
          attributeName: 'LastUpdated',
        },
        {
          value: Math.max(item.PlannedQuantity, item.RecurringQuantity),
          attributeName: "PlannedQuantity"
        }
      ]
    })));
    return toAdd.map(x => x.Id);
  }

  addToItemPlannedQuantity(id, addend) {
    this.data.addItemValue(id, "PlannedQuantity", addend);
  }

  addToItemRecurringQuantity(id, addend) {
    this.data.addItemValue(id, "RecurringQuantity", addend);
  }

  removeItemsFromShoppingList(itemIds) {
    const currentTimestamp = this._getCurrentTimestamp();
    this.data.batchUpdateItems(itemIds.map(id => ({
      id,
      updates: [
        {
          value: currentTimestamp,
          attributeName: 'LastUpdated',
        },
        {
          value: 0,
          attributeName: "PlannedQuantity"
        }
      ]
    })));
  }

  getItem(id) {
    return this._supplyMissingFields(this.data.getItem(id));
  }

  updateItem(attributes) {
    this.data.updateItem(attributes);
  }

  createItem(attributes) {
    if (!attributes.Name) {
      throw new Error("Name is required.");
    }
    const item = {
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
      Id: this._generateId("i-", 12),
    };
    this.data.createItem(item);
    return this._supplyMissingFields(item);
  }

  updateItemAndTimestamp(attributes) {
    this.data.updateItem({
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
    });
  }

  getShoppingList() {
    const caller = (new Error()).stack.split("\n")[2].trim().split(" ")[1];
    console.warn(`DEPRECATED. Use getShoppingPlan() instead. (Called from ${caller})`);
    return this.getShoppingPlan();
  }
  
  getShoppingPlan() {
    const all = [];
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    let totalOfRecurringItems = 0;
    const recurringItemsToAdd = [];
    const recurringItems = [];
    this.data.listItems("i-").map(item => this._supplyMissingFields(item)).forEach(item => {
      all.push(item);
      if (item.RecurringQuantity) {
        recurringItems.push(item);
        totalOfRecurringItems += item.RecurringQuantity * item.UnitPriceEstimate;

        if (item.PlannedQuantity < item.RecurringQuantity) {
          recurringItemsToAdd.push(item);
        }
      }
      if (item.PlannedQuantity) {
        shoppingList.push(item);
        total += item.PlannedQuantity * item.UnitPriceEstimate;
      } else {
        unselectedItems.push(item);
      }
    });
    const result = { all, shoppingList, unselectedItems, recurringItems, recurringItemsToAdd, total, totalOfRecurringItems };
    setTimeout(() => {
      Object.values(this.shoppingListConsumers).forEach(consumer => consumer.consumeShoppingList(result));
    });
    return result;
  }

  _supplyMissingFields(item) {
    return {
      LastUpdated: '0000-00-00T00:00:00.000Z',
      PlannedQuantity: 0,
      RecurringQuantity: 0,
      UnitPriceEstimate: 0,
      Type: "OTHER",
      ...item
    };
  }

  _getCurrentTimestamp() {
    return this.chronometer.getCurrentTimestamp();
  }

  _generateId(prefix, length) {
    const randomPart = (
      Math.random().toString(36).slice(2)
      + Math.random().toString(36).slice(2)
    ).slice(0, length);
    return prefix + randomPart;
  }

  _generateTimestampId(prefix, timestamp) {
    const timestampString = typeof timestamp === 'undefined' ? this._getCurrentTimestamp() : timestamp;
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
