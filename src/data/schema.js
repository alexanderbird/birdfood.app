import { mapAttributes } from './mapAttributes';

const NUMBER_TYPE = {
  convert: anything => anything ? Number(anything) : 0,
  toDynamoDb: anything => ({ N: anything.toString() }),
};

const STRING_TYPE = {
  convert: anything => anything ? anything.toString() : undefined,
  toDynamoDb: anything => ({ S: anything.toString() }),
};

const NUMERIC_ATTRIBUTES = new Set([
  "BoughtQuantity",
  "PlannedQuantity",
  "RequiredQuantity",
  "UnitPriceEstimate",
  "ActualUnitPrice",
  "RecurringQuantity",
  "TotalSpent",
  "EstimatedTotal"
]);

export function dataTypeOf(attribute) {
  if (NUMERIC_ATTRIBUTES.has(attribute)) {
    return NUMBER_TYPE;
  }
  return STRING_TYPE;
}

export const correctValueTypesFor = object => mapAttributes(object, ({ key, value }) => dataTypeOf(key).convert(value));
