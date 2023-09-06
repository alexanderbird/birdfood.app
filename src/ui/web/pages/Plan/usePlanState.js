import { useState } from 'preact/hooks';

import { useUpdatingState } from '../../hooks/useUpdatingState';
import { useGroceryItemEditFormDialog } from '../../components/GroceryItemEditFormDialog';
import { useClearListDialog } from '../../components/ClearListDialog';

export function usePlanState(core) {
  const [recentlyChangedItems, setLastChanged] = useState(new Set());
  const [cart, triggerUpdate] = useUpdatingState(core.getEmptyShoppingList(), () => core.getShoppingList());

  const onItemsModified = idOrIds => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setLastChanged(new Set(ids));
    triggerUpdate();
  };

  const GroceryItemEditFormDialogForPlan = useGroceryItemEditFormDialog({
    onSave: item => {
      core.updateItemAndTimestamp(item);
      onItemsModified(item.Id);
    }
  });

  const ClearListDialogForPlan = useClearListDialog({
    clearList: () => {
      core.removeItemsFromShoppingList(cart.shoppingList.map(x => x.Id));
      onItemsModified();
    }
  });

  return {
    cart,
    recentlyChangedItems,
    onItemsModified,
    GroceryItemEditFormDialogForPlan,
    ClearListDialogForPlan
  };
}

