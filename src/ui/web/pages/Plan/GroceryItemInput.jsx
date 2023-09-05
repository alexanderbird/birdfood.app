
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

export function GroceryItemInput({ items, onSelect, onCreate }) {
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
