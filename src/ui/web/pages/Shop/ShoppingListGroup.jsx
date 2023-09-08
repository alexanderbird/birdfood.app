import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ItemType, ItemTypeIcon } from '../../components/ItemTypeIcon';

export const ShoppingListGroup = ({ type, children, ...props }) => {
  return (
    <Box {...props} display="flex" flexDirection="column">
      <Typography><ItemTypeIcon type={type} /> {ItemType[type].label}</Typography>
      <List>
        { children }
      </List>
    </Box>
  );
};
