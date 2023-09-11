import { Header } from '../../components/Header.jsx';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const SchedulePageHeader = ({ cartTotal }) => {
  const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
  return (<>
    <Header>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="h6" component="div">Scheduled items</Typography>
        <Typography fontWeight="bold" variant="h6" component="div">{formatter.format(cartTotal)}</Typography>
      </Box>
    </Header>
    <Box display="flex" justifyContent="space-around" width="100%" mt={2} mb={2}>
      <Typography>We use up these items regularly.</Typography>
    </Box>
  </>);
};
