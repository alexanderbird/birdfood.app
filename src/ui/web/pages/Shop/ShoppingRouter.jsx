import { useLocation } from 'preact-iso';

import Box from '@mui/material/Box';
import CheckListIcon from '@mui/icons-material/CheckList';
import Typography from '@mui/material/Typography';

import { useLastYearShoppingEvents } from './useLastYearShoppingEvents';
import { Header } from '../../components/Header.jsx';
import { Page } from '../../components/Page';

export const ShoppingRouter = ({ core }) => {
  const location = useLocation();
  const [shoppingEvents, triggerUpdate] = useLastYearShoppingEvents(core);

  if (!shoppingEvents) {
    return <ShoppingLoadingPage />;
  }
  const inProgressShop = shoppingEvents.find(x => x.Status === "IN_PROGRESS");
  if (inProgressShop) {
    location.route(`/shop/${inProgressShop.Id}`);
  } else {
    location.route('/shop/start');
  }
};

const ShoppingLoadingPage = () => {
  return (
    <Page
      isLoading={true}
      header={
        <Header>
          <CheckListIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">Grocery Shopping</Typography>
        </Header>
      }
    />
  );
};
