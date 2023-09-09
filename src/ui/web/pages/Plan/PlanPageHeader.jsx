import Box from '@mui/material/Box';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Typography from '@mui/material/Typography';

import { Header } from '../../components/Header.jsx';
import { RunningLowIcon } from '../../components/icons/RunningLowIcon';

export const PlanPageHeader = ({ cartTotal }) => {
  const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
  return (<>
    <Header>
      <FormatListBulletedIcon sx={{ mr: 1 }} />
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="h6" component="div">Plan the next shop</Typography>
        <Typography fontWeight="bold" variant="h6" component="div">{formatter.format(cartTotal)}</Typography>
      </Box>
    </Header>
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" mt={2} mb={2}>
      <RunningLowIcon sx={{ fontSize: '256px' }} />
    </Box>
  </>);
};
