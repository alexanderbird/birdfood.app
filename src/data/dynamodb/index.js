import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  BatchGetItemCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { dataTypeOf } from '../schema';

export class DynamoDbData {
  constructor({ household, ...clientConfig }) {
    this._client = new DynamoDBClient(clientConfig);
    this._tableName = 'BirdFoodItems';
    this._household = household;
  }

  async updateItem({ Id, ...attributes }) {
    const setStatements = [];
    const deleteStatements = [];
    const attributeValues = {};
    const attributeNames = {};
    Object.entries(attributes).forEach(([ key, value ]) => {
      attributeNames[`#${key}`] = key;
      if (typeof value === 'undefined') {
        deleteStatements.push(`#${key}`);
      } else {
        setStatements.push(`#${key}=:${key}`);
        attributeValues[`:${key}`] = dataTypeOf(key).toDynamoDb(value);
      }
    });
    const UpdateExpression =
      (setStatements.length ? `SET ${setStatements.join(', ')} ` : '')
      + (deleteStatements.length ? `REMOVE ${deleteStatements.join(', ')} ` : '');
    const input = {
      TableName: this._tableName,
      Key: {
        Household: { S: this._household },
        Id: { S: Id },
      },
      UpdateExpression,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
      ConditionExpression: 'attribute_exists(Id)',
    };
    const command = new UpdateItemCommand(input);
    try {
      await this._client.send(command);
    } catch(e) {
      throw new Error(`Failed to update item ${  JSON.stringify(input, null, 2)}`, { cause: e });
    }
  }

  async getItem(id) {
    const input = {
      TableName: this._tableName,
      Key: {
        Household: { S: this._household },
        Id: { S: id },
      },
    };
    const command = new GetItemCommand(input);
    const response = await this._client.send(command);
    if (!response.Item) return false;
    return Object.fromEntries(Object.entries(response.Item)
      .filter(x => x[0] !== "Household")
      .map(x => [x[0], x[1].S || Number(x[1].N)]));
  }

  async batchGetItems(ids) {
    const items = await this._rawResponseFromBatchGetItems(ids);
    return items.map(x => this._fromDdbToObject(x));
  }

  async batchUpdateItems(itemChanges) {
    await Promise.all(this._chunkBy(itemChanges, 25).map(async chunkOfItemChanges => {
      const updatesById = {};
      const idsToUpdate = [];
      chunkOfItemChanges.forEach(itemChange => {
        idsToUpdate.push(itemChange.id);
        updatesById[itemChange.id] = itemChange.updates;
      });
      const items = await this._rawResponseFromBatchGetItems(idsToUpdate);

      const updated = item => {
        const updates = updatesById[item.Id.S];
        return Object.fromEntries(Object.entries(item)
          .concat(updates.map(({ attributeName, value }) => [attributeName, dataTypeOf(attributeName).toDynamoDb(value)])));
      };

      const input = {
        RequestItems: {
          [this._tableName]: items.map(item => ({
            PutRequest: {
              Item: updated(item)
            }
          }))
        },
      };
      const command = new BatchWriteItemCommand(input);
      await this._client.send(command);
    }));
  }

  async createOrUpdateItem({ Id, ...attributes }) {
    const attributeUpdates = Object.fromEntries(
      Object.entries(attributes)
        .map(([ key, value ]) => {
          if (typeof value === 'undefined') {
            return [key, { Action: "DELETE" }];
          }
          return [key, { Value: dataTypeOf(key).toDynamoDb(value), Action: "PUT" }];
        }));
    const input = {
      TableName: this._tableName,
      Key: {
        Household: { S: this._household },
        Id: { S: Id },
      },
      AttributeUpdates: attributeUpdates
    };
    const command = new UpdateItemCommand(input);
    try {
      await this._client.send(command);
    } catch(e) {
      throw new Error(`Failed to update item ${  JSON.stringify(attributeUpdates, null, 2)}`, { cause: e });
    }
  }

  async createItem(attributes) {
    const item = Object.fromEntries(
      Object.entries({ Household: this._household, ...attributes })
        .map(([key, value]) => {
          return [key, dataTypeOf(key).toDynamoDb(value)];
        }));
    const input = {
      TableName: this._tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(Id)',
      //Expected: { // ExpectedAttributeMap
      //"<keys>": { // ExpectedAttributeValue
      //Value: "<AttributeValue>",
      //Exists: true || false,
      //ComparisonOperator: "EQ" || "NE" || "IN" || "LE" || "LT" || "GE" || "GT" || "BETWEEN" || "NOT_NULL" || "NULL" || "CONTAINS" || "NOT_CONTAINS" || "BEGINS_WITH",
      //AttributeValueList: [ // AttributeValueList
      //"<AttributeValue>",
      //],
      //},
      //},
    };
    const command = new PutItemCommand(input);
    try {
      await this._client.send(command);
    } catch(e) {
      throw new Error(`Failed to create item ${  JSON.stringify(item, null, 2)}`, { cause: e });
    }
  }

  async addItemValue(id, attribute, addend) {
    const attributeUpdates = {
      [attribute]: {
        Value: { N: addend.toString() },
        Action: 'ADD'
      }
    };
    const input = {
      TableName: this._tableName,
      Key: {
        Household: { S: this._household },
        Id: { S: id },
      },
      AttributeUpdates: attributeUpdates
    };
    const command = new UpdateItemCommand(input);
    try {
      await this._client.send(command);
    } catch(e) {
      throw new Error(`Failed to update item ${  JSON.stringify(attributeUpdates, null, 2)}`, { cause: e });
    }
  }

  async listPurchaseHistoryItems(prefix) {
    const input = {
      TableName: this._tableName,
      KeyConditionExpression: "Household = :household AND begins_with(PurchaseHistoryId, :prefix)",
      IndexName: "ItemPurchaseHistory",
      ExpressionAttributeValues: {
        ":household": { S: this._household },
        ":prefix": { S: prefix },
      },
    };
    const response = await this._client.send(new QueryCommand(input));
    return response.Items.map(x => this._fromDdbToObject(x));
  }
  async listItems(prefix) {
    const input = {
      TableName: this._tableName,
      KeyConditionExpression: "Household = :household AND begins_with(Id, :prefix)",
      ExpressionAttributeValues: {
        ":household": { S: this._household },
        ":prefix": { S: prefix },
      },
      /* TODO: pagination
      ExclusiveStartKey: { // Key
        "<keys>": "<AttributeValue>",
      }, */
    };
    const response = await this._client.send(new QueryCommand(input));
    return response.Items.map(x => this._fromDdbToObject(x));
    // TODO: pagination
    //   LastEvaluatedKey: { // Key
    //     "<keys>": "<AttributeValue>",
    //   },
  }

  _fromDdbToObject(ddbItem) {
    return Object.fromEntries(Object.entries(ddbItem)
      .filter(x => x[0] !== "Household")
      .map(x => [x[0], x[1].S || Number(x[1].N)]));
  }

  async listItemsBetween(startInclusive, endInclusive) {
    const input = {
      TableName: this._tableName,
      KeyConditionExpression: "Household = :household AND Id BETWEEN :startInclusive AND :endInclusive",
      ExpressionAttributeValues: {
        ":household": { S: this._household },
        ":startInclusive": { S: startInclusive },
        ":endInclusive": { S: endInclusive },
      },
      /* TODO: pagination
      ExclusiveStartKey: { // Key
        "<keys>": "<AttributeValue>",
      }, */
    };
    const response = await this._client.send(new QueryCommand(input));
    return response.Items.map(x => this._fromDdbToObject(x));
    // TODO: pagination
    //   LastEvaluatedKey: { // Key
    //     "<keys>": "<AttributeValue>",
    //   },
  }

  _chunkBy(itemsToChunk, chunkSize) {
    // https://stackoverflow.com/a/44687374/3012550
    const list = [...itemsToChunk];
    return [...Array(Math.ceil(itemsToChunk.length / chunkSize))].map(() => list.splice(0, chunkSize));
  }


  async _rawResponseFromBatchGetItems(ids) {
    if (!ids.length) {
      return Promise.resolve([]);
    }
    const allPages = await Promise.all(this._chunkBy(ids, 100).map(async chunkOfIds => {
      const input = {
        RequestItems: {
          [this._tableName]: {
            Keys: chunkOfIds.map(id => ({
              Household: { S: this._household },
              Id: { S: id }
            }))
          },
        },
      };
      const command = new BatchGetItemCommand(input);
      const response = await this._client.send(command);
      return response.Responses[this._tableName];
    }));
    return allPages.flat();
  }
}
