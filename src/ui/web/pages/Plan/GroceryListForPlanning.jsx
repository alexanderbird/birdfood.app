import Button from '@mui/material/Button';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ClearIcon from '@mui/icons-material/Clear';

import { GroceryItemList } from '../../components/GroceryItemList';

export const GroceryListForPlanning = ({ items,
  core,
  recentlyChangedItems,
  onItemsModified,
  allowClearingTheList,
  allowAddingRecurringItems,
  openClearListDialog,
  openEditDialog
}) => {

  const setQuantity = async (id, quantity) => {
    await core.updateItem({ Id: id, PlannedQuantity: quantity });
    onItemsModified(id);
  };

  const updateQuantity = async (id, difference) => {
    await core.addToItemPlannedQuantity(id, difference);
    onItemsModified(id);
  };

  const addRecurringItems = async () => {
    const addedItemIds = await core.addRecurringItems();
    onItemsModified(addedItemIds);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  return (
    <GroceryItemList items={items}
      getQuantityForItem={item => item.PlannedQuantity}
      recentlyChangedItems={recentlyChangedItems}
      updateQuantity={updateQuantity}
      setQuantity={setQuantity}
      doEdit={openEditDialog}
      actions={[
        <Button key="addRecurringItems"
          onClick={addRecurringItems}
          disabled={!allowAddingRecurringItems}
          startIcon={<EventRepeatIcon />}
        >Add Recurring Items</Button>,
        <Button key="openClearListDialog"
          onClick={openClearListDialog}
          disabled={!allowClearingTheList}
          startIcon={<ClearIcon />}
        >Clear List</Button>,
      ]}
    />
  );
};

