import { useState, useEffect, useRef } from 'preact/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
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
  PRODUCE: { key: "PRODUCE", label: "Produce" },
  FROZEN: { key: "FROZEN", label: "Frozen" },
  OTHER: { key: "OTHER", label: "Other" }
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
  }

  const createItem = Name => {
    const item = core.createItem({ Name, PlannedQuantity: 1 })
    setLastChanged(new Set([item.Id]));
    triggerUpdate();
  }

  const addRecurringItems = () => {
    const addedItemIds = core.addRecurringItems();
    setLastChanged(new Set(addedItemIds));
    triggerUpdate();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  const updateQuantity = (id, difference, alsoUpdateLastUpdatedDate) => {
    core.addToItemShoppingListQuantity(id, difference, alsoUpdateLastUpdatedDate);
    setLastChanged(new Set([id]));
    triggerUpdate();
  }

  const setQuantity = (id, quantity) => {
    core.setItemPlannedQuantity(id, quantity);
    setLastChanged(new Set([id]));
    triggerUpdate();
  }

  const clearAll = () => {
    core.removeItemsFromShoppingList(selectedItems.map(x => x.value.Id));
    setLastChanged(new Set());
    triggerUpdate();
  }

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
        <GroceryItemInput items={items} onSelect={addItem} onCreate={createItem}/>
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

const GroceryFormEditDialog = ({ open, onCancel, onSave, initialValue }) => {
  const mergeWithDefaults = newValue => ({
    Name: "",
    Type: "OTHER",
    ...newValue,
    UnitPriceEstimate: Number(newValue.UnitPriceEstimate || 0).toFixed(2)
  });
  const [value, setValue] = useState(mergeWithDefaults(initialValue));
  useEffect(() => {
    setValue(mergeWithDefaults(initialValue));
  }, [initialValue]);
  return (
    <Dialog fullScreen open={open} onClose={onCancel}>
      <DialogTitle>Edit Grocery Item</DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { m: 1, width: 'auto' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            fullWidth
            label="Name"
            onChange={e => setValue(current => ({ ...current, Name: e.target.value }))}
            value={value.Name}
          />
          <TextField
            select
            required
            fullWidth
            value={value.Type}
            onChange={(e, x) => setValue(current => ({ ...current, Type: x.props.value }))} label="Type">
            { Object.values(ItemType).map(itemType =>
              <MenuItem value={itemType.key}><ItemTypeIcon type={itemType.key}/> {itemType.label}</MenuItem>
            ) }
          </TextField>
          <TextField
            fullWidth
            required
            label="Estimated Unit Price"
            onChange={event => setValue(current => ({ ...current, UnitPriceEstimate: event.target.value }))}
            value={value.UnitPriceEstimate}
            onBlur={event => {
              const formattedValue = Number(event.target.value).toFixed(2);
              setValue(current => ({ ...current, UnitPriceEstimate: formattedValue }))
            }}
            onFocus={event => {
              const formattedValue = Number(event.target.value);
              setValue(current => ({ ...current, UnitPriceEstimate: formattedValue }))
              setTimeout(() => event.target.select());
            }}
            inputProps={{
              sx: { textAlign: 'right' },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <Box display="flex">
            <TextField
              label="Next Shop"
              onChange={event => setValue(current => ({ ...current, PlannedQuantity: event.target.value }))}
              value={value.PlannedQuantity}
              onFocus={event => {
                event.target.select();
              }}
              inputProps={{
                sx: { textAlign: 'right' },
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><ShoppingCartIcon /></InputAdornment>,
              }}
            />
            <TextField
              label="Recurring"
              onChange={event => setValue(current => ({ ...current, RecurringQuantity: event.target.value }))}
              value={value.RecurringQuantity}
              onFocus={event => {
                event.target.select();
              }}
              inputProps={{
                sx: { textAlign: 'right' },
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EventRepeatIcon /></InputAdornment>,
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(value)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function asItems(groceryItems) {
  return groceryItems.map(x => ({
    label: x.Name,
    value: x
  }));
}

const GroceryItemList = ({
  items, removeAll, updateQuantity, setQuantity,
  addRecurringItems, thereAreMoreRecurringItemsToAdd,
  lastChanged, doEdit }) => {

  const MinusIcon = ({ item }) =>
    item.value.PlannedQuantity > 1
    ? <RemoveIcon sx={{ fontSize: 14 }} />
    : <ClearIcon sx={{ fontSize: 14 }} />;

  return (
    <List>
      { items.map(item => <>
        <ListItem selected={lastChanged.has(item.value.Id)}>
          <ListItemAvatar><Avatar><ItemTypeIcon type={item.value.Type} /></Avatar></ListItemAvatar>
          <Box sx={{ flexDirection: 'column', display: 'flex', flexGrow: 1 }}>
            <Link color="inherit" underline="none" onClick={() => doEdit(item.value)}>
              <ListItemText primary={item.label} sx={{ alignSelf: 'flex-start' }}/>
            </Link>
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
      { Array.from(Array(Math.max(10, (value + 1))).keys()).map(i => <MenuItem value={i}>{i}</MenuItem>) }
    </Select>
  );
}


function GroceryItemInput({ items, onSelect, onCreate }) {
  const ref = useRef();
  const [inputValue, setInputValue] = useState("");
  const resetInput = () => {
    setInputValue("");
    const input = ref.current.querySelector('input');
    input.blur();
  }
  const createNewItemFromInput = () => {
    resetInput();
    onCreate(inputValue);
  }
  return (
    <Autocomplete
      ref={ref}
      isOptionEqualToValue={(one, two) => one.value.Id === two.value.Id}
      noOptionsText={<Button onClick={createNewItemFromInput} startIcon={<AddIcon />}>Create "{inputValue}"</Button>}
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
        resetInput();
        if (item) {
          onSelect(item);
        }
      }}
      renderOption={(props, option) => <ListItem {...props} disabled={option.value.PlannedQuantity > 0}>{option.label}</ListItem>}
      renderInput={(params) => <TextField {...params} label="Add Item" />}
    />
  );
}
