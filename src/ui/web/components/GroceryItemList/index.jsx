import { useState } from 'preact/hooks';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import * as colors from '@mui/material/colors';

import { Currency } from '../../components/Currency';
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
  const selected = item => recentlyChangedItems.has(item.value.Id);
  return (<>
    <SortModeToggle value={sortMode} onChange={setSortMode} />
    <List>
      { displayItems.map(item =>
        <ListItem key={item.value.Id} selected={selected(item)} divider>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: selected(item) ? colors.grey[50] : colors.blue[50] }}>
              <ItemTypeIcon type={item.value.Type} />
            </Avatar>
          </ListItemAvatar>
          <Box sx={{ flexDirection: 'column', display: 'flex', flexGrow: 1 }} >
            <ListItemText
              primary={
                <Button
                  onClick={() => doEdit(item.value)}
                  variant="text"
                  sx={{
                    marginTop: -1,
                    marginLeft: -1,
                    marginBottom: 0,
                    paddingRight: 0,
                    color: 'inherit',
                    width: '100%',
                    textTransform: 'unset',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ width: 'auto', textAlign: 'left' }} >
                    {item.label}
                  </Typography>
                  <EditIcon fontSize="small" sx={{ color: colors.grey[700] }} />
                </Button>
              } />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontSize="smaller" sx={{ color: colors.grey[700], flexGrow: 0 }}>
                <Button
                  onClick={() => doEdit(item.value)}
                  variant="text"
                  sx={{ margin: -1, color: 'inherit', display: 'flex', justifyContent: 'flex-start', alignItems: 'start' }}
                >
                  { item.value.UnitPriceEstimate ? null : <WarningIcon mr={1} /> }
                  <Currency>{item.value.UnitPriceEstimate * getQuantityForItem(item.value)}</Currency>
                </Button>
              </Typography>
              <ButtonGroup sx={{ flexGrow: 1, zIndex: 10, marginLeft: 'auto', justifyContent: 'flex-end' }}>
                <Button onClick={() => updateQuantity(item.value.Id, -1, item.value)}><MinusIcon item={item} /></Button>
                <QuantitySelector value={getQuantityForItem(item.value)} onChange={quantity => setQuantity(item.value.Id, quantity, item.value)} />
                <Button onClick={() => updateQuantity(item.value.Id, 1, item.value)}><AddIcon sx={{ fontSize: 14 }} /></Button>
              </ButtonGroup>
            </Box>
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

