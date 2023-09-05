import { useState } from 'preact/hooks';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useDialogState } from '../../hooks/useDialogState';
import { useUpdatingState } from '../../hooks/useUpdatingState';
import { Page } from '../../components/Page';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { useGroceryFormEditDialog } from './GroceryFormEditDialog';
import { GroceryListForPlanning } from './GroceryListForPlanning';
import { PlanPageHeader } from './PlanPageHeader';
import { AutocompleteForPlanning } from './AutocompleteForPlanning';

export function Plan({ core }) {
  const clearListDialog = useDialogState();
  const [recentlyChangedItems, setLastChanged] = useState(new Set());
  const [cart, triggerUpdate] = useUpdatingState(core.getEmptyShoppingList(), () => core.getShoppingList());

  const [openEditDialog, GroceryFormEditDialog] = useGroceryFormEditDialog({
    onSave: item => {
      core.updateItem(item);
      onItemsModified(item.Id);
    }
  });

  const onItemsModified = idOrIds => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setLastChanged(new Set(ids));
    triggerUpdate();
  };

  const clearAll = () => {
    core.removeItemsFromShoppingList(cart.shoppingList.map(x => x.Id));
    onItemsModified();
  };

  return (
    <Page
      header={<PlanPageHeader cartTotal={cart.total} />}
      body={
        <Container>
          <AutocompleteForPlanning core={core} items={cart.all} onItemsModified={onItemsModified} />
          <GroceryListForPlanning core={core}
            items={cart.shoppingList}
            onItemsModified={onItemsModified}
            recentlyChangedItems={recentlyChangedItems}
            allowAddingRecurringItems={cart.recurringItemsToAdd.length > 0}
            allowClearingTheList={cart.shoppingList.length}
            openClearListDialog={clearListDialog.open}
            openEditDialog={openEditDialog}
          />
        </Container>
      }
      dialogs={<>
        <ConfirmDialog
          open={clearListDialog.isOpen}
          onCancel={clearListDialog.close}
          confirmText="Clear List"
          onConfirm={() => { clearAll(); clearListDialog.close(); }}
        >
          <Typography>
            Do you want to empty the list?
            `You are about to remove { cart.shoppingList.length } item{ cart.shoppingList.length === 1 ? '' : 's'}.
          </Typography>
        </ConfirmDialog>
        <GroceryFormEditDialog />
      </>}
    />
  );
}
