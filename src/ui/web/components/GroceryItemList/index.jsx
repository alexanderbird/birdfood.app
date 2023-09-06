import { useState } from 'preact/hooks';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import * as colors from '@mui/material/colors';

import { ItemTypeIcon } from '../../components/ItemTypeIcon';
import { SortMode, SortModeToggle } from '../SortMode';
import { LabeledValue } from '../../dataStructures/LabeledValue';

export const GroceryItemList = ({
  items,
  getQuantityForItem,
  updateQuantity,
  setQuantity,
  actions,
  recentlyChangedItems,
  doEdit
}) => {
  const [sortMode, setSortMode] = useState(SortMode.NEWEST_FIRST.key);

  const MinusIcon = ({ item }) =>
    getQuantityForItem(item.value) > 1
      ? <RemoveIcon sx={{ fontSize: 14 }} />
      : <ClearIcon sx={{ fontSize: 14 }} />;

  const displayItems = items
    .map(LabeledValue.factory(x => x.Name))
    .sort(SortMode[sortMode].sortFunction);
  return (<>
    <SortModeToggle value={sortMode} onChange={setSortMode} />
    <List>
      { displayItems.map(item =>
        <ListItem key={item.value.Id} selected={recentlyChangedItems.has(item.value.Id)} divider>
          <ListItemAvatar><Avatar sx={{ bgcolor: colors.grey[100] }}><ItemTypeIcon type={item.value.Type} /></Avatar></ListItemAvatar>
          <Box sx={{ flexDirection: 'column', display: 'flex', flexGrow: 1 }}>
            <Link color="inherit" underline="none" onClick={() => doEdit(item.value)}>
              <ListItemText primary={item.label} sx={{ alignSelf: 'flex-start' }} />
            </Link>
            <ButtonGroup sx={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => updateQuantity(item.value.Id, -1)}><MinusIcon item={item} /></Button>
              <QuantitySelector value={getQuantityForItem(item.value)} onChange={quantity => setQuantity(item.value.Id, quantity)} />
              <Button onClick={() => updateQuantity(item.value.Id, 1)}><AddIcon sx={{ fontSize: 14 }} /></Button>
            </ButtonGroup>
          </Box>
        </ListItem>
      ) }
      { actions.filter(x => !!x).map(action => (
        <ListItem key={action.props.key} divider>{ action }</ListItem>
      ))}
    </List>
  </>);
};

function QuantitySelector({ value, onChange }) {
  return (
    <Select value={value} onChange={(event, object) => onChange(object.props.value)} sx={{ borderRadius: 0, height: 28 }}>
      { Array.from(Array(Math.max(10, (value + 1))).keys()).map(i => <MenuItem key={i} value={i}>{i}</MenuItem>) }
    </Select>
  );
}

