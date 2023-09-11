import { Header } from '../../components/Header.jsx';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ShoppingHistoryPageHeader = () => {
  return (<>
    <Header>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="h6" component="div">Grocery shopping history</Typography>
      </Box>
    </Header>
  </>);
};
