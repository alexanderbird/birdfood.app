import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ItemType, ItemTypeIcon } from '../../components/ItemTypeIcon';
import { Header } from '../../components/Header.jsx';

export const PlanPageHeader = ({ cartTotal }) => {
  const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
  return (<>
    <Header>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="h6" component="div">Plan the next shop</Typography>
        <Typography fontWeight="bold" variant="h6" component="div">{formatter.format(cartTotal)}</Typography>
      </Box>
    </Header>
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-around" width="100%" mt={3} mb={4}>
      { Object.keys(ItemType).map(key => <ItemTypeIcon key={key} type={key} />) }
    </Box>
  </>);
};
