import { GroceryItemInput } from '../../components/GroceryItemInput';

export const AutocompleteForPlanning = ({ core, items, onItemsModified }) => {
  const addItem = item => {
    const id = item.value.Id;
    core.addToItemPlannedQuantity(id, 1);
    core.updateItemAndTimestamp({ Id: id });
    onItemsModified(id);
  };

  const createItem = Name => {
    const item = core.createItem({ Name, PlannedQuantity: 1 });
    onItemsModified(item.Id);
  };

  return (
    <GroceryItemInput items={items} onSelect={addItem} onCreate={createItem} inputLabel="We're running low on..." />
  );
};

