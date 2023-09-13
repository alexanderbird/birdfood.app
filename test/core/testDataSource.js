import { EmptyStaticData } from '../../src/data/static';
import { DynamoDbData } from '../../src/data/dynamodb';

export function testDataSource() {
  if (process.env.DATA_SOURCE?.toLowerCase() === "dynamodb") {
    return new DynamoDbData();
  }
  return new EmptyStaticData();
}
