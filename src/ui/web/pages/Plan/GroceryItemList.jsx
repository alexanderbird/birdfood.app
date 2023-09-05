import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClearIcon from '@mui/icons-material/Clear';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import { ItemTypeIcon } from '../../components/ItemTypeIcon';

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
              <ListItemText primary={item.label} sx={{ alignSelf: 'flex-start' }} />
            </Link>
            <ButtonGroup sx={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => updateQuantity(item.value.Id, -1)}><MinusIcon item={item} /></Button>
              <QuantitySelector value={item.value.PlannedQuantity} onChange={quantity => setQuantity(item.value.Id, quantity)} />
              <Button onClick={() => updateQuantity(item.value.Id, 1)}><AddIcon sx={{ fontSize: 14 }} /></Button>
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
};

function QuantitySelector({ value, onChange }) {
  return (
    <Select value={value} onChange={(event, object) => onChange(object.props.value)} sx={{ borderRadius: 0, height: 28 }}>
      { Array.from(Array(Math.max(10, (value + 1))).keys()).map(i => <MenuItem value={i}>{i}</MenuItem>) }
    </Select>
  );
}

