import { useState, useEffect } from 'preact/hooks';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';

import { CurrencyTextField } from '../CurrencyTextField';
import { ItemType, ItemTypeIcon } from '../../components/ItemTypeIcon';
import { useDialogState } from '../../hooks/useDialogState';

export function useGroceryItemEditFormDialog({ onSave }) {
  const editDialog = useDialogState();

  const StatefulGroceryItemEditFormDialog = () => 
    <GroceryItemEditFormDialog
      open={editDialog.isOpen}
      onCancel={editDialog.close}
      initialValue={editDialog.data}
      onSave={async item => { await onSave(item); editDialog.close(); }} 
    />;

  StatefulGroceryItemEditFormDialog.open = editDialog.open;
  return StatefulGroceryItemEditFormDialog;
}

export const GroceryItemEditFormDialog = ({ open, onCancel, onSave, initialValue }) => {
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
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onCancel} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Grocery Item
          </Typography>
          <Button autoFocus color="inherit" onClick={() => onSave(value)}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
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
            sx={{
              '& .MuiInputBase-input': {
                display: 'flex',
                '& .MuiListItemIcon-root': {
                  minWidth: 36,
                }
              }
            }}
            value={value.Type}
            onChange={(e, x) => setValue(current => ({ ...current, Type: x.props.value }))}
            label="Type">
            { Object.values(ItemType).map(itemType =>
              <MenuItem key={itemType.key} value={itemType.key}>
                <ListItemIcon sx={{ minWidth: 0 }}><ItemTypeIcon type={itemType.key} /></ListItemIcon>
                <ListItemText>{itemType.label}</ListItemText>
              </MenuItem>
            ) }
          </TextField>
          <CurrencyTextField 
            fullWidth
            required
            label="Estimated Unit Price"
            setValue={value => setValue(current => ({ ...current, UnitPriceEstimate: value }))}
            value={value.UnitPriceEstimate}
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
                type: 'number',
                inputMode: 'numeric'
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
                type: 'number',
                inputMode: 'numeric'
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EventRepeatIcon /></InputAdornment>,
              }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};


