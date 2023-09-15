import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
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

  batchGetItems(ids) {
    console.warn('Not Implemented');
    return Promise.resolve([]);
  }

  async createOrUpdateItem({ Id, ...attributes }) {
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

  batchUpdateItems(itemChanges) {
    console.warn('Not Implemented');
    return Promise.resolve();
  }

  async listItems(prefix) {
    const input = {
      TableName: this._tableName,
      Select: "ALL_ATTRIBUTES",
      KeyConditionExpression: "Household = :household AND begins_with(Id, :prefix)",
      ExpressionAttributeValues: {
          ":household": {"S": this._household },
          ":prefix": {"S": prefix },
      },
      /* TODO: pagination
      ExclusiveStartKey: { // Key
        "<keys>": "<AttributeValue>",
      }, */
    };
    const response = await this._client.send(new QueryCommand(input));
    return response.Items.map(x => Object.fromEntries(Object.entries(x)
      .filter(x => x[0] !== "Household")
      .map(x => [x[0], x[1].S || Number(x[1].N)])));
    // TODO: pagination
    //   LastEvaluatedKey: { // Key
    //     "<keys>": "<AttributeValue>",
    //   },
  }

  listItemsBetween(startInclusive, endInclusive) {
    console.warn('Not Implemented');
    return Promise.resolve([]);
  }
}
