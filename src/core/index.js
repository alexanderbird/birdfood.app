import { Chronometer } from './Chronometer';
import { ShoppingEventCache } from './ShoppingEventCache';

export class Core {
  constructor(data, chronometer) {
    this.chronometer = chronometer || new Chronometer();
    this.data = data;
    this.shoppingListConsumers = {};
  }

  async startShopping(attributes) {
    const shoppingEvent = {
      ...attributes,
      Id: this._generateTimestampId("se-"),
      StartedAt: this._getCurrentTimestamp(),
      Status: "IN_PROGRESS",
    };
    await this.data.createItem(shoppingEvent);
    return shoppingEvent;
  }

  async buyItem(shoppingEventId, attributes) {
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
    if (!Number.isInteger(Number(attributes.BoughtQuantity || attributes.Quantity))) {
      throw new Error("Required attribute 'Quantity' is missing or is not an integer");
    }
    const boughtItem = {
      Id: `sei#${shoppingEventId}#${itemId}`,
      ...attributes,
      BoughtQuantity: Number(attributes.BoughtQuantity || attributes.Quantity),
      Quantity: undefined,
    };
    await this.data.putItem(boughtItem);
    return boughtItem;
  }

  _assembleItemForShoppingEvent(plannedItem, completedItem) {
    return ({
      Id: plannedItem.Id,
      Name: plannedItem.Name,
      Type: plannedItem.Type || 'OTHER',
      RequiredQuantity: plannedItem.PlannedQuantity,
      UnitPriceEstimate: plannedItem.UnitPriceEstimate,
      BoughtQuantity: completedItem?.BoughtQuantity || 0,
      ActualUnitPrice: completedItem?.ActualUnitPrice
    });
  }

  async getShoppingEventCompletedItems(id) {
    const completedItems = await this.data.listItems(`sei#${id}#i-`);

    const itemId = shoppingEventItemId => shoppingEventItemId.replace(/^sei#[^#]*#/, '');
    const items = await this.data.batchGetItems(
      completedItems.map(x => itemId(x.Id)));

    const itemsMap = Object.fromEntries(items
      .map(x => [x.Id, x]));

    const list = completedItems
      .map(completedItem => this._assembleItemForShoppingEvent(itemsMap[itemId(completedItem.Id)], completedItem))
      .map(({ RequiredQuantity, UnitPriceEstimate, ...rest }) => rest);

    return {
      list
    };
  }

  async getShoppingEventSnapshot(id) {
    const [shoppingEventItems, planItems] = await Promise.all([
      this.data.listItems(`sei#${id}#i-`),
      this.data.listItems("i-")
    ]);
    return { shoppingEventItems, planItems };
  }

  async getShoppingEventItemCache(id) {
    const { shoppingEventItems, planItems } = await this.getShoppingEventSnapshot(id);
    return ShoppingEventCache.assemble({
      persistItemUpdate: attributes => this.data.putItem(attributes),
      shoppingEventItems,
      planItems
    });
  }

  async getShoppingListItems(id) {
    const completedItems = Object.fromEntries(
      (await this.data.listItems(`sei#${  id  }#i-`))
        .map(x => [x.Id.replace(/^sei#se-[0-9a-z-]+#/, ''), x]));
    const completedItemIds = new Set(Object.keys(completedItems));
    const processedItemIds = new Set();
    const listA = (await this.data.listItems("i-"))
      .filter(x => x.PlannedQuantity)
      .map(x => { processedItemIds.add(x.Id); return x; })
      .map(plannedItem => this._assembleItemForShoppingEvent(plannedItem, completedItems[plannedItem.Id]));

    const itemsThatHaveBeenRemovedFromThePlannedListAfterMarkingThemAsComplete =
      Array.from(completedItemIds).filter(id => !processedItemIds.has(id));
    const listB = itemsThatHaveBeenRemovedFromThePlannedListAfterMarkingThemAsComplete.length
      ? (await this.data.batchGetItems(itemsThatHaveBeenRemovedFromThePlannedListAfterMarkingThemAsComplete))
        .map(plannedItem => this._assembleItemForShoppingEvent(plannedItem, completedItems[plannedItem.Id]))
      : [];
    const list = listA.concat(listB);

    const statistics = list.reduce((statistics, item) => {
      const actual = item.BoughtQuantity * (item.ActualUnitPrice || item.UnitPriceEstimate);
      const expected = item.RequiredQuantity * item.UnitPriceEstimate;
      return {
        runningTotal: statistics.runningTotal + actual,
        estimatedTotal: statistics.estimatedTotal + expected,
      };
    }, { runningTotal: 0, estimatedTotal: 0 });
    return {
      statistics,
      list
    };
  }

  async getShoppingEvent(id, legacyMode) {
    if (!id.startsWith("se-")) {
      const error = new Error('The shopping event description ID must start with "se-"');
      error.code = "ResourceNotFound";
      throw error;
    }

    const description = await this.data.getItem(id);

    if (!description) {
      const error = new Error(`Shopping Event not found "${id}"`);
      error.code = "ResourceNotFound";
      throw error;
    }

    if (!legacyMode) {
      return description;
    }

    const itemsAndStatistics = description.Status === "IN_PROGRESS"
      ? await this.getShoppingListItems(id)
      : await this.getShoppingEventCompletedItems(id);

    return {
      ...itemsAndStatistics,
      description
    };
  }

  async listShoppingEvents(startDate, endDate) {
    const start = this._generateTimestampId("se-", startDate.toISOString());
    const end = this._generateTimestampId("se-", endDate.toISOString());
    return await this.data.listItemsBetween(start, end);
  }

  async stopShopping(id, attributes = {}) {
    const shoppingEvent = await this.data.getItem(id);
    if (!shoppingEvent) {
      throw new Error(`Cannot stop Shopping Event ${id}`);
    }
    const shoppingEventItemsPrefix = `sei#${  id  }#i-`;
    const completedItems = await this.data.listItems(shoppingEventItemsPrefix);
    const currentPlannedQuantities = Object.fromEntries(
      (await this.data.batchGetItems(completedItems.map(x => x.ItemId)))
        .map(x => [x.Id, x.PlannedQuantity]));
    const updates = completedItems
      .map(completedItem => ({
        id: completedItem.ItemId,
        updates: [{
          attributeName: "PlannedQuantity",
          value: Math.max(0,
            currentPlannedQuantities[completedItem.ItemId] - completedItem.BoughtQuantity)
        }]
      }))
      .concat({ id, updates: Object.entries({ ...attributes, Status: "COMPLETE" })
        .map(x => ({ attributeName: x[0], value: x[1] }))
      });
    await this.data.batchUpdateItems(updates);
  }

  offShoppingListUpdate(key) {
    delete this.shoppingListConsumers[key];
  }

  onShoppingListUpdate(key, consumeShoppingList) {
    this.shoppingListConsumers[key] = { key, consumeShoppingList };
  }

  async addRecurringItems() {
    const toAdd = (await this.getShoppingPlan()).recurringItemsToAdd;
    const currentTimestamp = this._getCurrentTimestamp();
    await this.data.batchUpdateItems(toAdd.map(item => ({
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

  async addToItemPlannedQuantity(id, addend) {
    await this.data.addItemValue(id, "PlannedQuantity", addend);
  }

  async addToItemRecurringQuantity(id, addend) {
    await this.data.addItemValue(id, "RecurringQuantity", addend);
  }

  async removeItemsFromShoppingList(itemIds) {
    const currentTimestamp = this._getCurrentTimestamp();
    await this.data.batchUpdateItems(itemIds.map(id => ({
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

  async getItem(id) {
    return this._supplyMissingFields(await this.data.getItem(id));
  }

  async updateItem(attributes) {
    await this.data.updateItem(attributes);
  }

  async createItem(attributes) {
    if (!attributes.Name) {
      throw new Error("Name is required.");
    }
    const item = {
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
      Id: this._generateId("i-", 12),
    };
    await this.data.createItem(item);
    return this._supplyMissingFields(item);
  }

  async updateItemAndTimestamp(attributes) {
    await this.data.updateItem({
      ...attributes,
      LastUpdated: this._getCurrentTimestamp(),
    });
  }

  async getShoppingList() {
    const caller = (new Error()).stack.split("\n")[2].trim().split(" ")[1];
    console.warn(`DEPRECATED. Use getShoppingPlan() instead. (Called from ${caller})`);
    return this.getShoppingPlan();
  }
  
  async getShoppingPlan() {
    const all = [];
    const shoppingList = [];
    const unselectedItems = [];
    let total = 0;
    let totalOfRecurringItems = 0;
    const recurringItemsToAdd = [];
    const recurringItems = [];
    (await this.data.listItems("i-")).map(item => this._supplyMissingFields(item)).forEach(item => {
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
