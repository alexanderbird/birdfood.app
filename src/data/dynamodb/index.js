import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  BatchGetItemCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
/* eslint-disable */
// Disabled linting since this is a placeholder file with lots of unused params
// After it's implemented, we can re-enable linting
export class DynamoDbData {
  constructor({ household }) {
    this._client = new DynamoDBClient();
    this._tableName = 'BirdFoodItems';
    this._household = household;
  }

  async updateItem({ Id, ...attributes }) {
    // TODO: ensure that it exists (this must not be a create)
    const attributeUpdates = Object.fromEntries(
      Object.entries(attributes)
        .map(([ key, value ]) => {
          if (typeof value === 'undefined') {
            return [key, { Action: "DELETE" }];
          }
          const type = typeof value === 'number' ? 'N' : 'S';
          return [key, { Value: { [type]: value.toString() }, Action: "PUT" }];
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
      throw new Error("Failed to update item " + JSON.stringify(attributeUpdates, null, 2), { cause: e });
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
    return Object.fromEntries(Object.entries(response.Item)
      .filter(x => x[0] !== "Household")
      .map(x => [x[0], x[1].S || Number(x[1].N)]));
  }

  async batchGetItems(ids) {
    const items = await this._rawResponseFromBatchGetItems(ids);
    return items.map(x => this._fromDdbToObject(x));
  }

  async batchUpdateItems(itemChanges) {
    const updatesById = {};
    const idsToUpdate = [];
    itemChanges.forEach(itemChange => {
      idsToUpdate.push(itemChange.id);
      updatesById[itemChange.id] = itemChange.updates;
    });
    const items = await this._rawResponseFromBatchGetItems(idsToUpdate);

    const updated = item => {
      const updates = updatesById[item.Id.S];
      return Object.fromEntries(Object.entries(item)
        .concat(updates.map(({ attributeName, value }) => [attributeName, this._toDdbValue(value)])));
    }

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
  }

  _toDdbValue(value) {
    const type = typeof value === 'number' ? 'N' : 'S';
    return { [type]: value.toString() };
  }

  async createOrUpdateItem({ Id, ...attributes }) {
    const attributeUpdates = Object.fromEntries(
      Object.entries(attributes)
        .map(([ key, value ]) => {
          if (typeof value === 'undefined') {
            return [key, { Action: "DELETE" }];
          }
          return [key, { Value: this._toDdbValue(value), Action: "PUT" }];
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
      throw new Error("Failed to update item " + JSON.stringify(attributeUpdates, null, 2), { cause: e });
    }
  }

  async createItem(attributes) {
    const item = Object.fromEntries(
      Object.entries({ Household: this._household, ...attributes })
        .map(([key, value]) => {
        const type = typeof value === 'number' ? 'N' : 'S';
        return [key, { [type]: value.toString() }];
      }));
    const input = {
      TableName: this._tableName,
      Item: item,
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
      throw new Error("Failed to create item " + JSON.stringify(item, null, 2), { cause: e });
    }
  }

  async addItemValue(id, attribute, addend) {
    const attributeUpdates = {
      [attribute]: {
        Value: { N: addend.toString() },
        Action: 'ADD'
      }
    }
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
      throw new Error("Failed to update item " + JSON.stringify(attributeUpdates, null, 2), { cause: e });
    }
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
      .map(x => [x[0], x[1].S || Number(x[1].N)]))
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


  async _rawResponseFromBatchGetItems(ids) {
    if (!ids.length) {
      return Promise.resolve([]);
    }
    // TODO batch the request by 100s
    const input = {
      RequestItems: {
        [this._tableName]: {
          Keys: ids.map(id => ({
            Household: { S: this._household },
            Id: { S: id }
          }))
        },
      },
    };
    const command = new BatchGetItemCommand(input);
    const response = await this._client.send(command);
    return response.Responses[this._tableName];
  }
}
