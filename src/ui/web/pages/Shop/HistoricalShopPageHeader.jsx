import { Header } from '../../components/Header.jsx';

import Box from '@mui/material/Box';
import HistoryIcon from '@mui/icons-material/History';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { Currency } from '../../components/Currency';
import { ShoppingEventSummary } from './ShoppingEventSummary';

export const HistoricalShopPageHeader = ({ shoppingEvent }) => {
  return (<>
    <Header>
      <HistoryIcon sx={{ mr: 1 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Typography variant="h6" component="div"><ShoppingEventSummary variant="oneline" event={shoppingEvent?.description} /></Typography>
      </Box>
    </Header>
    <Box>
      <Typography sx={{ px: 4 }}>
        Estimated <Currency>{shoppingEvent?.description.EstimatedTotal}</Currency>
        , spent <Currency>{shoppingEvent?.description.TotalSpent}</Currency>
      </Typography>
      <Divider sx={{ mt: 2 }} />
    </Box>
  </>);
};
