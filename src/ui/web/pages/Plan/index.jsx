import { useState, useEffect } from 'preact/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Header } from '../../components/Header.jsx';
import { StaticData } from '../../../../data/static';
import { Core } from '../../../../core';

export function Plan() {
  const [serial, setSerial] = useState(Date.now());
  const triggerUpdate = () => setSerial(Date.now());
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmEmptyDialogOpen, setConfirmEmptyDialogOpen] = useState(false);
  const closeConfirmEmptyDialog = () => setConfirmEmptyDialogOpen(false);
  const openConfirmEmptyDialog = () => setConfirmEmptyDialogOpen(true);
  const core = new Core(new StaticData());

  const clearAll = () => {
    core.removeItemsFromShoppingList(selectedItems.map(x => x.value.Id));
    triggerUpdate();
  }

  const addItem = item => {
    core.setItemPlannedQuantity(item.value.Id, 1);
    triggerUpdate();
  }

  useEffect(() => {
    const { shoppingList, unselectedItems } = core.getShoppingList();
    setItems(asItems(unselectedItems)); 
    setSelectedItems(asItems(shoppingList));
  }, [serial]);
  return (<>
    <Header>
      Plan the next shop
    </Header>
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Container maxWidth="sm">
        <ComboBox items={items} onSelect={addItem}/>
        <TheList items={selectedItems} removeAll={openConfirmEmptyDialog} />
      </Container>
    </Box>
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
  </>);
}

function asItems(groceryItems) {
  return groceryItems.map(x => ({
    label: x.Name,
    value: x
  }));
}

const TheList = ({ items, removeAll }) => {

  return (
    <List>{ items.map(item => 
      <>
      <ListItem>
        <ListItemText primary={item.label} />
      </ListItem>
      <Divider component="li" />
      </>
    ) }
    { !items.length ? null : 
      <ListItem>
        <Button onClick={removeAll}>Clear List</Button>
      </ListItem>
    }
    </List>
  );
}


function ComboBox({ items, onSelect }) {
  const [value, setValue] = useState(" ");
  return (
    <Autocomplete disablePortal
      handleHomeEndKeys
      autoComplete
      autoHighlight
      blurOnSelect
      freeSolo
      clearOnBlur
      includeInputInList
      inputValue={value}
      options={items}
      onChange={(event, item) => {
        setValue(" ");
        if (item) {
          onSelect(item);
        }
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Add Item" />}
    />
  );
}
