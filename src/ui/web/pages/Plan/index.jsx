import { useState, useEffect } from 'preact/hooks';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

import { useDialogState } from '../../hooks/useDialogState';
import { useSerial } from '../../hooks/useSerial';
import { LabeledValue } from '../../dataStructures/LabeledValue';
import { Page } from '../../components/Page';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { GroceryFormEditDialog } from './GroceryFormEditDialog';
import { GroceryItemInput } from './GroceryItemInput';
import { GroceryItemList } from './GroceryItemList';
import { PlanPageHeader } from './PlanPageHeader';
import { lexicalComparison } from './SortMode';

export function Plan({ core }) {
  const [lastChanged, setLastChanged] = useState(new Set());
  const [serial, triggerUpdate] = useSerial();
  const [cart, setCart] = useState(core.getEmptyShoppingList());
  const editDialog = useDialogState();
  const clearListDialog = useDialogState();

  const saveEditDialog = item => {
    core.updateItem(item);
    editDialog.close();
    triggerUpdate();
  };

  const createItem = Name => {
    const item = core.createItem({ Name, PlannedQuantity: 1 });
    setLastChanged(new Set([item.Id]));
    triggerUpdate();
  };

  const addRecurringItems = () => {
    const addedItemIds = core.addRecurringItems();
    setLastChanged(new Set(addedItemIds));
    triggerUpdate();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  const updateQuantity = (id, difference, alsoUpdateLastUpdatedDate) => {
    core.addToItemShoppingListQuantity(id, difference, alsoUpdateLastUpdatedDate);
    setLastChanged(new Set([id]));
    triggerUpdate();
  };

  const setQuantity = (id, quantity) => {
    core.setItemPlannedQuantity(id, quantity);
    setLastChanged(new Set([id]));
    triggerUpdate();
  };

  const clearAll = () => {
    core.removeItemsFromShoppingList(cart.shoppingList.map(x => x.Id));
    setLastChanged(new Set());
    triggerUpdate();
  };

  const addItem = item => updateQuantity(item.value.Id, 1, true);

  useEffect(() => {
    setCart(core.getShoppingList());
  }, [serial]);

  ;
  return (
    <Page
      header={<PlanPageHeader cartTotal={cart.total} />}
      body={
        <Container>
          <GroceryItemInput items={cart.all} onSelect={addItem} onCreate={createItem} />
          <GroceryItemList items={cart.shoppingList}
            lastChanged={lastChanged}
            updateQuantity={updateQuantity}
            setQuantity={setQuantity}
            doEdit={editDialog.open}
            actions={[
              <Button onClick={addRecurringItems}
                disabled={cart.recurringItemsToAdd.length <= 0}
                startIcon={<EventRepeatIcon />}
                >Add Recurring Items</Button>,
              <Button onClick={clearListDialog.open}
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
            Do you want to remove
            { cart.shoppingList.length === 1
              ? ` "${cart.shoppingList[0].label.trim()}" `
              : ` all ${cart.shoppingList.length} items `
            }
            from the list?
          </Typography>
        </ConfirmDialog>
        <GroceryFormEditDialog open={editDialog.isOpen} onCancel={editDialog.close} onSave={saveEditDialog} initialValue={editDialog.data} />
      </>}
      />
  );
}


