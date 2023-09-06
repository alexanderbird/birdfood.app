import { useState } from 'preact/hooks';

import { useUpdatingState } from '../../hooks/useUpdatingState';
import { useGroceryItemEditFormDialog } from '../../components/GroceryItemEditFormDialog';

export function useScheduleState(core) {
  const [recentlyChangedItems, setLastChanged] = useState(new Set());
  const [cart, triggerUpdate] = useUpdatingState(core.getEmptyShoppingList(), () => core.getShoppingList());

  const onItemsModified = idOrIds => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setLastChanged(new Set(ids));
    triggerUpdate();
  };

  const GroceryItemEditFormDialogForSchedule = useGroceryItemEditFormDialog({
    onSave: item => {
      core.updateItem(item);
      onItemsModified(item.Id);
    }
  });

  return {
    cart,
    recentlyChangedItems,
    onItemsModified,
    GroceryItemEditFormDialogForSchedule
  };
}

