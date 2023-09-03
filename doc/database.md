# Database Design

Using AWS DynamoDB because at the scale of this app the cost is negligible.

Each user will be associated with a "household ID" (random alphanumeric prefixed
with "h-") which will be the partition key for the table. Every user in the same
household will see the same data. Different households have independent data.

| PK             | SK                                 | Attributes                                                                             |
|----------------|------------------------------------|----------------------------------------------------------------------------------------|
| h-36a39efdf372 | item#i-a92acf57729b                | HouseholdId, Id, Name, Type, UnitPriceEstimate, PlannedQuantity, RecurringQuantity     |
| h-36a39efdf372 | shop#s-08dcce28dbb8#summary        | HouseholdId, Id, Year, Month, Day, Store, TotalSpent, Status { IN_PROGRESS, COMPLETE } |
| h-36a39efdf372 | shop#s-08dcce28dbb8#i-a92acf57729b | HouseholdId, ShopId, Id, ActualUnitPrice, Quantity                                     |

In addition to the primary index, we'll have a Local Secondary Index on
ItemId+ShopId (e.g. "item#i-a92acf57729b#s-08dcce28dbb8") which can be used to
retrieve the shopping history for a specific item (query SK starts with
"item#i-a92acf57729b#s-").
