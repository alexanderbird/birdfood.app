import ListItem from '@mui/material/ListItem';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Currency } from '../../components/Currency';

export const ShoppingList = ({ items, showRequiredAmount, onItemQuantityChange }) => {
  if (!items) {
    return null;
  }
  return (<>
    { items.sort((lhs, rhs) => lhs.Name < rhs.Name ? -1 : 1).map(item => (
      <ListItem key={item.Id} dense onClick={() => onItemQuantityChange(item.Id, item.RequiredQuantity)}>
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
  </>);
};
