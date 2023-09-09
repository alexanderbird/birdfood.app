import { GroceryItemInput } from '../../components/GroceryItemInput';

export const AutocompleteForScheduling = ({ core, items, onItemsModified }) => {
  const addItem = item => {
    const id = item.value.Id;
    core.addToItemRecurringQuantity(id, 1);
    core.updateItemAndTimestamp({ Id: id });
    onItemsModified(id);
  };

  const createItem = Name => {
    const item = core.createItem({ Name, RecurringQuantity: 1 });
    onItemsModified(item.Id);
  };

  return (
    <GroceryItemInput items={items} onSelect={addItem} onCreate={createItem} inputLabel="Add recurring item" />
  );
};

