
import { useState, useRef } from 'preact/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import { ItemType } from '../../components/ItemTypeIcon';
import { lexicalComparison } from '../SortMode';
import { LabeledValue } from '../../dataStructures/LabeledValue';

export function GroceryItemInput({ items, onSelect, onCreate }) {
  const ref = useRef();
  const [inputValue, setInputValue] = useState("");
  const resetInput = () => {
    setInputValue("");
    const input = ref.current.querySelector('input');
    input.blur();
  };
  const createNewItemFromInput = () => {
    resetInput();
    onCreate(inputValue);
  };
  const displayItems = items
    .sort((lhs, rhs) => lexicalComparison(lhs.Type, rhs.Type))
    .map(LabeledValue.factory(x => x.Name));
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
      options={displayItems}
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
