import Button from '@mui/material/Button';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ClearIcon from '@mui/icons-material/Clear';

import { GroceryItemList } from './GroceryItemList';

export const GroceryListForPlanning = ({ items,
  core,
  recentlyChangedItems,
  onItemsModified,
  allowClearingTheList,
  allowAddingRecurringItems,
  openClearListDialog,
  openEditDialog
}) => {

  const setQuantity = (id, quantity) => {
    core.updateItem({ Id: id, PlannedQuantity: quantity });
    onItemsModified(id);
  };

  const updateQuantity = (id, difference) => {
    core.addToItemPlannedQuantity(id, difference);
    onItemsModified(id);
  };

  const addRecurringItems = () => {
    const addedItemIds = core.addRecurringItems();
    onItemsModified(addedItemIds);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  return (
    <GroceryItemList items={items}
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

