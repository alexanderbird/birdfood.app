import { Header } from '../../components/Header.jsx';

import Box from '@mui/material/Box';
import CheckListIcon from '@mui/icons-material/CheckList';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { Currency } from '../../components/Currency';
import { ShoppingEventSummary } from './ShoppingEventSummary';

export const HistoricalShopPageHeader = ({ shoppingEvent }) => {
  return (<>
    <Header>
      <CheckListIcon sx={{ mr: 1 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Typography variant="h6" component="div"><ShoppingEventSummary event={shoppingEvent?.description} /></Typography>
      </Box>
    </Header>
    <Box>
      <Typography sx={{ px: 4 }}>
        Estimated <Currency>{shoppingEvent?.statistics.estimatedTotal}</Currency>
        , spent <Currency>{shoppingEvent?.statistics.runningTotal}</Currency>
      </Typography>
      <Divider sx={{ mt: 2 }}/>
    </Box>
  </>);
};
