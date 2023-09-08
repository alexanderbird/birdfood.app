import { useState } from 'preact/hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Currency } from '../../components/Currency';
import { useOutsideClickAlerter } from '../../hooks/useOutsideClickAlerter';
import { ItemType, ItemTypeIcon } from '../../components/ItemTypeIcon';

export const ShoppingListGroup = ({ type, items, showRequiredAmount, onItemQuantityChange, ...props }) => {
  const ref = useOutsideClickAlerter(() => setSelectedItem(false));
  const [selectedItem, setSelectedItem] = useState(false);
  if (!items) {
    return null;
  }
  const handleItemClick = item => {
    onItemQuantityChange(item.Id, item.RequiredQuantity);
    setSelectedItem(item.Id);
  };
  return (
    <Box {...props} display="flex" flexDirection="column" ref={ref}>
      <Typography><ItemTypeIcon type={type} /> {ItemType[type].label}</Typography>
      <List>
        { items.sort((lhs, rhs) => lhs.Name < rhs.Name ? -1 : 1).map(item => (
          <ListItem key={item.Id} dense onClick={() => handleItemClick(item)} selected={item.Id === selectedItem}>
            <ListItemIcon>
              { item.BoughtQuantity >= (item.RequiredQuantity || 0)
                ? <CheckBoxIcon fontSize="large" />
                : <CheckBoxOutlineBlankIcon fontSize="large" />
              }
            </ListItemIcon>
            <ListItemText
              primary={ showRequiredAmount
                ? `${item.BoughtQuantity}/${item.RequiredQuantity} ${item.Name}`
                : `${item.BoughtQuantity} ${item.Name}`
              }
              secondary={<span><Currency>{item.UnitPriceEstimate || item.ActualUnitPrice}</Currency> each</span>} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
