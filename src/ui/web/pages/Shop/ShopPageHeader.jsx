import { Header } from '../../components/Header.jsx';

import Box from '@mui/material/Box';
import CheckListIcon from '@mui/icons-material/CheckList';
import Typography from '@mui/material/Typography';
import { ShoppingEventSummary } from './ShoppingEventSummary';

export const ShopPageHeader = ({ description }) => {
  return (<>
    <Header>
      <CheckListIcon sx={{ mr: 1 }} />
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="h6" component="div">Shop on <ShoppingEventSummary event={description} /></Typography>
      </Box>
    </Header>
  </>);
};
