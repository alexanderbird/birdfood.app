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
import { Header } from '../../components/Header.jsx';

export const GroceryFormEditDialog = ({ open, onCancel, onSave, initialValue }) => {
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

