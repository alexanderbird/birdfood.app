import { GroceryItemInput } from '../../components/GroceryItemInput';

export const AutocompleteForPlanning = ({ core, items, onItemsModified }) => {
  const addItem = async item => {
    const id = item.value.Id;
    await core.addToItemPlannedQuantity(id, 1);
    await core.updateItemAndTimestamp({ Id: id });
    onItemsModified(id);
  };

  const createItem = async Name => {
    const item = await core.createPlanItem({ Name, PlannedQuantity: 1 });
    onItemsModified(item.Id);
  };

  return (
    <GroceryItemInput items={items} onSelect={addItem} onCreate={createItem} inputLabel="We're running low on..."
      deEmphasizeItem={x => x.PlannedQuantity > 0}
    />

  );
};

