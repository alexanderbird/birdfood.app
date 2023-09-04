import { useState, useEffect, useRef } from 'preact/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ClearIcon from '@mui/icons-material/Clear';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ItemTypeIcon } from '../../components/ItemTypeIcon';
import { Header } from '../../components/Header.jsx';
import { StaticData } from '../../../../data/static';
import { Core } from '../../../../core';

function lexicalComparison(lhs, rhs) {
  if (lhs === rhs) return 0;
  return lhs < rhs ? -1 : 1;
}

function reverseLexicalComparison(lhs, rhs) {
  return -1 * lexicalComparison(lhs, rhs);
}

const ItemType = {
  BABY: { key: "BABY", label: "Baby Food" },
  DRY_GOOD: { key: "DRY_GOOD", label: "Dry Goods" },
  DAIRY: { key: "DAIRY", label: "Dairy" },
  DELI: { key: "DELI", label: "Meats" },
  BAKERY: { key: "BAKERY", label: "Bakery" },
  FROZEN: { key: "FROZEN", label: "Frozen" },
}

const SortMode = {
  NEWEST_FIRST: {
    key: "NEWEST_FIRST",
    label: "Newest First",
    sortFunction: (lhs, rhs) => reverseLexicalComparison(lhs.value.LastUpdated, rhs.value.LastUpdated)
  },
  BY_TYPE: {
    key: "BY_TYPE",
    label: "By Type",
    sortFunction: (lhs, rhs) => lexicalComparison(lhs.value.Type, rhs.value.Type)
  },
  ALPHABETICAL: {
    key: "ALPHABETICAL",
    label: "A-Z",
    sortFunction: (lhs, rhs) => lexicalComparison(lhs.label, rhs.label)
  },
}

function SortModeToggle({ value, onChange }) {
  return (
    <Box flexDirection="row" justifyContent="space-around" sx={{ marginY: 2, display: 'flex' }}>
      <ToggleButtonGroup value={value} exclusive onChange={(e, v) => onChange(v)}>
      { Object.values(SortMode).map(x =>
          <ToggleButton value={x.key} sx={{ paddingY: 0 }}>{x.label}</ToggleButton>
        )}
      </ToggleButtonGroup>
    </Box>
  );
}

export function Plan() {
  const core = new Core(new StaticData());
  const [serial, setSerial] = useState(Date.now());
  const [sortMode, setSortMode] = useState(SortMode.NEWEST_FIRST.key);
  const triggerUpdate = () => setSerial(Date.now());
  const [cart, setCart] = useState(core.getEmptyShoppingList());
  const [confirmEmptyDialogOpen, setConfirmEmptyDialogOpen] = useState(false);
  const closeConfirmEmptyDialog = () => setConfirmEmptyDialogOpen(false);
  const openConfirmEmptyDialog = () => setConfirmEmptyDialogOpen(true);

  const createItem = Name => {
    core.createItem({ Name, PlannedQuantity: 1 })
    triggerUpdate();
  }

  const addRecurringItems = () => {
    core.addRecurringItems();
    triggerUpdate();
  }

  const updateQuantity = (id, difference) => {
    core.addToItemShoppingListQuantity(id, difference);
    triggerUpdate();
  }

  const setQuantity = (id, quantity) => {
    core.setItemPlannedQuantity(id, quantity);
    triggerUpdate();
  }

  const clearAll = () => {
    core.removeItemsFromShoppingList(selectedItems.map(x => x.value.Id));
    triggerUpdate();
  }

  const addItem = item => setQuantity(item.value.Id, 1);

  useEffect(() => {
    setCart(core.getShoppingList());
  }, [serial]);

  const selectedItems = asItems(cart.shoppingList).sort(SortMode[sortMode].sortFunction); 
  const items = asItems(cart.unselectedItems); 
  const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
  return (<>
    <Header>
      <ShoppingCartIcon sx={{ mr: 1 }} />
      <Typography variant="h6" component="div">Plan the next shop ({formatter.format(cart.total)})</Typography>
    </Header>
    <Box sx={{ width: '100%', maxWidth: 520, marginX: 'auto', bgcolor: 'background.paper' }}>
      <Container>
        <AddItemInput items={items} onSelect={addItem} onCreate={createItem}/>
        <SortModeToggle value={sortMode} onChange={setSortMode} />
        <TheList items={selectedItems} removeAll={openConfirmEmptyDialog} updateQuantity={updateQuantity} setQuantity={setQuantity}
          addRecurringItems={addRecurringItems}
          thereAreMoreRecurringItemsToAdd={cart.recurringItemsToAdd.length > 0}
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

const TheList = ({ items, removeAll, updateQuantity, setQuantity, addRecurringItems, thereAreMoreRecurringItemsToAdd }) => {

  const MinusIcon = ({ item }) =>
    item.value.PlannedQuantity > 1
    ? <RemoveIcon sx={{ fontSize: 14 }} />
    : <ClearIcon sx={{ fontSize: 14 }} />;

  return (
    <List>
      { items.map(item => <>
        <ListItem>
          <ListItemAvatar><Avatar><ItemTypeIcon type={item.value.Type} /></Avatar></ListItemAvatar>
          <Box sx={{ flexDirection: 'column', display: 'flex', flexGrow: 1 }}>
            <ListItemText primary={item.label} sx={{ alignSelf: 'flex-start' }}/>
            <ButtonGroup sx={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => updateQuantity(item.value.Id, -1)}><MinusIcon item={item} /></Button>
              <QuantitySelector value={item.value.PlannedQuantity} onChange={quantity => setQuantity(item.value.Id, quantity)} />
              <Button onClick={() => updateQuantity(item.value.Id, 1)}><AddIcon sx={{ fontSize: 14 }}/></Button>
            </ButtonGroup>
          </Box>
        </ListItem>
        <Divider component="li" />
      </>) }
      { !items.length ? null : <>
        <ListItem>
          <Button startIcon={<ClearIcon />} onClick={removeAll}>Clear List</Button>
        </ListItem>
        <Divider component="li" />
      </>}
      { !thereAreMoreRecurringItemsToAdd ? null : 
        <ListItem>
          <Button startIcon={<EventRepeatIcon />} onClick={addRecurringItems}>Add Recurring Items</Button>
        </ListItem>
      }
    </List>
  );
}

function QuantitySelector({ value, onChange }) {
  return (
    <Select value={value} onChange={(event, object) => onChange(object.props.value)} sx={{ borderRadius: 0, height: 28 }}>
      { Array.from(Array(10).keys()).map(i => <MenuItem value={i}>{i}</MenuItem>) }
    </Select>
  );
}


function AddItemInput({ items, onSelect, onCreate }) {
  const ref = useRef();
  const [inputValue, setInputValue] = useState("");
  return (
    <Autocomplete
      ref={ref}
      isOptionEqualToValue={(one, two) => one.value.Id === two.value.Id}
      noOptionsText={<Button onClick={() => onCreate(inputValue)} startIcon={<AddIcon />}>Create "{inputValue}"</Button>}
      groupBy={x => ItemType[x.value.Type]?.label || x.value.Type}
      disablePortal
      autoComplete
      clearOnBlur
      inputValue={inputValue}
      options={items}
      onInputChange={(event, input) => {
        setInputValue(input);
      }}
      onChange={(event, item) => {
        setInputValue("");
        const input = ref.current.querySelector('input');
        input.blur();
        if (item) {
          onSelect(item);
        }
      }}
      renderInput={(params) => <TextField {...params} label="Add Item" />}
    />
  );
}
