import { useState } from 'preact/hooks';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

import { useDialogState } from '../../hooks/useDialogState';
import { useUpdatingState } from '../../hooks/useUpdatingState';
import { Page } from '../../components/Page';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { GroceryFormEditDialog } from './GroceryFormEditDialog';
import { GroceryItemList } from './GroceryItemList';
import { PlanPageHeader } from './PlanPageHeader';
import { AutocompleteForPlanning } from './AutocompleteForPlanning';

export function Plan({ core }) {
  const editDialog = useDialogState();
  const clearListDialog = useDialogState();
  const [cart, triggerUpdate] = useUpdatingState(core.getEmptyShoppingList(), () => core.getShoppingList());

  const [lastChanged, setLastChanged] = useState(new Set());

  const onItemsModified = idOrIds => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    setLastChanged(new Set(ids));
    triggerUpdate();
  }

  const saveEditDialog = item => {
    core.updateItem(item);
    editDialog.close();
    triggerUpdate();
  };

  const updateQuantityAndTimestamp = (id, difference) => {
    core.addToItemPlannedQuantity(id, difference);
    core.updateItemAndTimestamp({ Id: id });
    setLastChanged(new Set([id]));
    triggerUpdate();
  };

  const updateQuantity = (id, difference) => {
    core.addToItemPlannedQuantity(id, difference);
    setLastChanged(new Set([id]));
    triggerUpdate();
  };

  const setQuantity = (id, quantity) => {
    core.updateItem({ Id: id, PlannedQuantity: quantity });
    setLastChanged(new Set([id]));
    triggerUpdate();
  };


  const addRecurringItems = () => {
    const addedItemIds = core.addRecurringItems();
    setLastChanged(new Set(addedItemIds));
    triggerUpdate();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  const clearAll = () => {
    core.removeItemsFromShoppingList(cart.shoppingList.map(x => x.Id));
    setLastChanged(new Set());
    triggerUpdate();
  };

  return (
    <Page
      header={<PlanPageHeader cartTotal={cart.total} />}
      body={
        <Container>
          <AutocompleteForPlanning core={core} items={cart.all} onItemsModified={onItemsModified} />
          <GroceryItemList items={cart.shoppingList}
            lastChanged={lastChanged}
            updateQuantity={updateQuantity}
            setQuantity={setQuantity}
            doEdit={editDialog.open}
            actions={[
              <Button key="addRecurringItems"
                onClick={addRecurringItems}
                disabled={cart.recurringItemsToAdd.length <= 0}
                startIcon={<EventRepeatIcon />}
              >Add Recurring Items</Button>,
              <Button key="openClearListDialog"
                onClick={clearListDialog.open}
                disabled={!cart.shoppingList.length}
                startIcon={<ClearIcon />}
              >Clear List</Button>,
            ]}
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
        <GroceryFormEditDialog open={editDialog.isOpen} onCancel={editDialog.close} onSave={saveEditDialog} initialValue={editDialog.data} />
      </>}
    />
  );
}
