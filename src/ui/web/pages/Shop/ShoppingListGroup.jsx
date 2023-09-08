import { useState } from 'preact/hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextField from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as colors from '@mui/material/colors';

import { CurrencyTextField } from '../../components/CurrencyTextField';
import { Currency } from '../../components/Currency';
import { useOutsideClickAlerter } from '../../hooks/useOutsideClickAlerter';
import { ItemType, ItemTypeIcon } from '../../components/ItemTypeIcon';

export const ShoppingListGroup = ({ type, items, editable, updateItem, ...props }) => {
  const ref = useOutsideClickAlerter(() => setSelectedItem(false));
  const [selectedItem, setSelectedItem] = useState(false);
  if (!items) {
    return null;
  }
  const handleItemClick = item => {
    setSelectedItem(item.Id);
    if (item.BoughtQuantity <= 0) {
      updateItem({ ItemId: item.Id, Quantity: item.RequiredQuantity });
    }
  };
  const isSelected = item => editable && item.Id === selectedItem;
  return (
    <Box {...props} display="flex" flexDirection="column" ref={ref}>
      <Typography><ItemTypeIcon type={type} /> {ItemType[type].label}</Typography>
      <List>
        { items.sort((lhs, rhs) => lhs.Name < rhs.Name ? -1 : 1).map(item => (
          <ListItem key={item.Id} dense alignItems="flex-start" onClick={() => handleItemClick(item)} selected={isSelected(item)}>
            <ListItemContent item={item} showRequiredAmount={editable} selected={isSelected(item)} updateItem={updateItem} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const ListItemContent = ({ item, selected, showRequiredAmount, updateItem }) => {
  return (<>
    <ListItemIcon>
      { item.BoughtQuantity >= (item.RequiredQuantity || 0)
        ? <CheckBoxIcon fontSize="large" />
        : item.BoughtQuantity > 0
          ? <IndeterminateCheckBoxIcon fontSize="large" />
          : <CheckBoxOutlineBlankIcon fontSize="large" />
      }
    </ListItemIcon>
    <ListItemText
      primary={showRequiredAmount
        ? <span>{item.BoughtQuantity}<Typography variant="inherit" component="span" sx={{ color: colors.grey[500] }}>/{item.RequiredQuantity}</Typography> {item.Name}</span>
        : `${item.BoughtQuantity} ${item.Name}`
      }
      secondary={<>
        <span><Currency>{item.UnitPriceEstimate || item.ActualUnitPrice}</Currency> each</span>
        { !selected ? null : (
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2}>
            <TextField
              size="small"
              label="Quantity"
              value={item.BoughtQuantity}
              sx={{ mr: 1 }}
              onFocus={e => e.target.select()}
              onChange={x => updateItem({ ItemId: item.Id, Quantity: x.target.value || 0 })}
              InputProps={{
                endAdornment: <InputAdornment position="end">/{item.RequiredQuantity}</InputAdornment>,
              }}
              inputProps={{
                type: 'number',
                inputMode: 'numeric'
              }}
            />
            <CurrencyTextField
              size="small"
              label="Unit Price"
              value={item.ActualUnitPrice}
              setValue={ActualUnitPrice => updateItem({ ItemId: item.Id, ActualUnitPrice, Quantity: item.BoughtQuantity })}
            />
          </Box>
        )}
      </>}
    />
  </>);
};
