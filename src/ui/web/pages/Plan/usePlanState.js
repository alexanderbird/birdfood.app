import { useState } from 'preact/hooks';

import { useUpdatingState } from '../../hooks/useUpdatingState';
import { useGroceryFormEditDialog } from './GroceryFormEditDialog';
import { useClearListDialog } from './ClearListDialog';

export function usePlanState(core) {
  const [recentlyChangedItems, setLastChanged] = useState(new Set());
  const [cart, triggerUpdate] = useUpdatingState(core.getEmptyShoppingList(), () => core.getShoppingList());

  const onItemsModified = idOrIds => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setLastChanged(new Set(ids));
    triggerUpdate();
  };

  const GroceryFormEditDialog = useGroceryFormEditDialog({
    onSave: item => {
      core.updateItem(item);
      onItemsModified(item.Id);
    }
  });

  const ClearListDialog = useClearListDialog({
    clearList: () => {
      core.removeItemsFromShoppingList(cart.shoppingList.map(x => x.Id));
      onItemsModified();
    }
  });

  return {
    cart,
    recentlyChangedItems,
    onItemsModified,
    GroceryFormEditDialog,
    ClearListDialog
  };
}

