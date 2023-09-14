import { v4 as uuidv4 } from 'uuid';

import { EmptyStaticData } from '../../src/data/static';
import { DynamoDbData } from '../../src/data/dynamodb';

export function testDataSource() {
  if (process.env.DATA_SOURCE?.toLowerCase() === "dynamodb") {
    return new DynamoDbData({ household: `test-household-${uuidv4()}` });
  }
  return new EmptyStaticData();
}
