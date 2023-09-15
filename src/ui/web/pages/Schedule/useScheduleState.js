import { useState } from 'preact/hooks';

import { useUpdatingState } from '../../hooks/useUpdatingState';
import { useGroceryItemEditFormDialog } from '../../components/GroceryItemEditFormDialog';
import { useConfirmDialog } from '../../components/ConfirmDialog';

export function useScheduleState(core) {
  const [recentlyChangedItems, setLastChanged] = useState(new Set());
  const [cart, triggerUpdate] = useUpdatingState(false, () => core.getShoppingList());

  const onItemsModified = idOrIds => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setLastChanged(new Set(ids));
    triggerUpdate();
  };

  const GroceryItemEditFormDialogForSchedule = useGroceryItemEditFormDialog({
    onSave: async item => {
      await core.updateItemAndTimestamp(item);
      onItemsModified(item.Id);
    }
  });

  const ConfirmRemoveItemDialog = useConfirmDialog({
    onConfirm: async ({ item, difference }) => {
      if (typeof difference === 'number') {
        await core.addToItemRecurringQuantity(item.Id, difference);
      } else {
        await core.updateItemAndTimestamp(item);
      }
      onItemsModified(item.Id);
    }
  });

  return {
    cart,
    recentlyChangedItems,
    onItemsModified,
    GroceryItemEditFormDialogForSchedule,
    ConfirmRemoveItemDialog
  };
}

