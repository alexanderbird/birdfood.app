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

import { ItemType, ItemTypeIcon } from '../../components/ItemTypeIcon';

export const GroceryItemList = ({
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

