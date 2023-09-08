import { Header } from '../../components/Header.jsx';

import Box from '@mui/material/Box';
import CheckListIcon from '@mui/icons-material/CheckList';
import Typography from '@mui/material/Typography';

import { Currency } from '../../components/Currency';

export const ShopPageHeader = ({ shoppingEvent }) => {
  return (<>
    <Header>
      <CheckListIcon sx={{ mr: 1 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Typography variant="h6" component="div">Shopping</Typography>
        <Typography>
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            <Currency>{shoppingEvent?.statistics?.runningTotal}</Currency>
          </Typography>
          /
          <Currency>{shoppingEvent?.statistics?.estimatedTotal}</Currency>
        </Typography>
      </Box>
    </Header>
  </>);
};
