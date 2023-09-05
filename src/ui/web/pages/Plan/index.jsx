import { useState, useEffect } from 'preact/hooks';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

import { Header } from '../../components/Header.jsx';
import { StaticData } from '../../../../data/static';
import { Core } from '../../../../core';
import { GroceryFormEditDialog } from './GroceryFormEditDialog';
import { GroceryItemInput } from './GroceryItemInput';
import { GroceryItemList } from './GroceryItemList';
import { SortMode, SortModeToggle, lexicalComparison } from './SortMode';

export function Plan() {
  const core = new Core(new StaticData());
  const [lastChanged, setLastChanged] = useState(new Set());
  const [serial, setSerial] = useState(Date.now());
  const [sortMode, setSortMode] = useState(SortMode.NEWEST_FIRST.key);
  const triggerUpdate = () => setSerial(Date.now());
  const [cart, setCart] = useState(core.getEmptyShoppingList());
  const [editDialogData, setEditDialogData] = useState(false);
  const editDialogOpen = !!editDialogData;
  const closeEditDialog = () => setEditDialogData(false);
  const [confirmEmptyDialogOpen, setConfirmEmptyDialogOpen] = useState(false);
  const closeConfirmEmptyDialog = () => setConfirmEmptyDialogOpen(false);
  const openConfirmEmptyDialog = () => setConfirmEmptyDialogOpen(true);

  const saveEditDialog = item => {
    core.updateItem(item);
    closeEditDialog();
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
    core.removeItemsFromShoppingList(selectedItems.map(x => x.value.Id));
    setLastChanged(new Set());
    triggerUpdate();
  };

  const addItem = item => updateQuantity(item.value.Id, 1, true);

  useEffect(() => {
    setCart(core.getShoppingList());
  }, [serial]);

  const selectedItems = asItems(cart.shoppingList).sort(SortMode[sortMode].sortFunction); 
  const items = asItems(cart.all.sort((lhs, rhs) => lexicalComparison(lhs.Type, rhs.Type))); 
  const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
  return (<>
    <Header>
      <ShoppingCartIcon sx={{ mr: 1 }} />
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="h6" component="div">Shopping List</Typography>
        <Typography fontWeight="bold" variant="h6" component="div">{formatter.format(cart.total)}</Typography>
      </Box>
    </Header>
    <Box sx={{ width: '100%', maxWidth: 520, marginX: 'auto', bgcolor: 'background.paper' }}>
      <Container>
        <GroceryItemInput items={items} onSelect={addItem} onCreate={createItem} />
        <SortModeToggle value={sortMode} onChange={setSortMode} />
        <GroceryItemList items={selectedItems}
          lastChanged={lastChanged}
          removeAll={openConfirmEmptyDialog}
          updateQuantity={updateQuantity}
          setQuantity={setQuantity}
          addRecurringItems={addRecurringItems}
          thereAreMoreRecurringItemsToAdd={cart.recurringItemsToAdd.length > 0}
          doEdit={setEditDialogData}
        />
        <Dialog open={confirmEmptyDialogOpen} onClose={closeConfirmEmptyDialog}>
          <DialogTitle>Clear List</DialogTitle>
          <DialogContent dividers>
            <Typography>
              Do you want to remove
              { selectedItems.length === 1
                ? ` "${selectedItems[0].label.trim()}" `
                : ` all ${selectedItems.length} items `
              }
              from the list?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmEmptyDialog}>Cancel</Button>
            <Button variant="primary" onClick={() => { clearAll(); closeConfirmEmptyDialog(); }}>Clear List</Button>
          </DialogActions>
        </Dialog>
        <GroceryFormEditDialog open={editDialogOpen} onCancel={closeEditDialog} onSave={saveEditDialog} initialValue={editDialogData} />

      </Container>
    </Box>
  </>);
}

function asItems(groceryItems) {
  return groceryItems.map(x => ({
    label: x.Name,
    value: x
  }));
}


