import { useState } from 'preact/hooks';
import Container from '@mui/material/Container';

import { useUpdatingState } from '../../hooks/useUpdatingState';
import { Page } from '../../components/Page';
import { useGroceryFormEditDialog } from './GroceryFormEditDialog';
import { useClearListDialog } from './ClearListDialog';
import { GroceryListForPlanning } from './GroceryListForPlanning';
import { PlanPageHeader } from './PlanPageHeader';
import { AutocompleteForPlanning } from './AutocompleteForPlanning';

function usePlanState(core) {
  const [recentlyChangedItems, setLastChanged] = useState(new Set());
  const [cart, triggerUpdate] = useUpdatingState(core.getEmptyShoppingList(), () => core.getShoppingList());

  const onItemsModified = idOrIds => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setLastChanged(new Set(ids));
    triggerUpdate();
  };

  const [openEditDialog, GroceryFormEditDialog] = useGroceryFormEditDialog({
    onSave: item => {
      core.updateItem(item);
      onItemsModified(item.Id);
    }
  });

  const [openClearListDialog, ClearListDialog] = useClearListDialog({
    clearList: () => {
      core.removeItemsFromShoppingList(cart.shoppingList.map(x => x.Id));
      onItemsModified();
    }
  });

  return {
    cart,
    recentlyChangedItems,
    onItemsModified,
    openEditDialog,
    GroceryFormEditDialog,
    openClearListDialog,
    ClearListDialog
  };
}

export function Plan({ core }) {
  const { cart, recentlyChangedItems, onItemsModified, openEditDialog, GroceryFormEditDialog, openClearListDialog, ClearListDialog } = usePlanState(core);

  return (
    <Page
      header={<PlanPageHeader cartTotal={cart.total} />}
      body={
        <Container>
          <AutocompleteForPlanning
            core={core}
            items={cart.all}
            onItemsModified={onItemsModified} />
          <GroceryListForPlanning
            core={core}
            items={cart.shoppingList}
            onItemsModified={onItemsModified}
            recentlyChangedItems={recentlyChangedItems}
            allowAddingRecurringItems={cart.recurringItemsToAdd.length > 0}
            allowClearingTheList={cart.shoppingList.length}
            openClearListDialog={openClearListDialog}
            openEditDialog={openEditDialog}
          />
        </Container>
      }
      dialogs={<>
        <ClearListDialog itemsCount={cart.shoppingList.length} />
        <GroceryFormEditDialog />
      </>}
    />
  );
}
