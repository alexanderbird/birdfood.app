import { useLocation } from 'preact-iso';

import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import PendingIcon from '@mui/icons-material/Pending';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useLastYearShoppingEvents } from './useLastYearShoppingEvents';
import { Page } from '../../components/Page';
import { ShoppingHistoryPageHeader } from './ShoppingHistoryPageHeader';
import { ShoppingEventSummary } from './ShoppingEventSummary';

export const ShoppingHistory = ({ core }) => {
  const location = useLocation();
  const { eventNotFound } = location.query;

  const [shoppingEvents] = useLastYearShoppingEvents(core);
  return (
    <Page
      isLoading={!shoppingEvents}
      header={<ShoppingHistoryPageHeader />}
      body={() =>
        <Container>
          { !eventNotFound ? null : <Alert severity="error">There is no shopping event with ID "{eventNotFound}"</Alert> }
          <List dense>
            { !shoppingEvents ? null : shoppingEvents.reverse().map(shoppingEvent => (
              <ListItem
                key={shoppingEvent.Id}
                selected={shoppingEvent.Status === "IN_PROGRESS"}
                onClick={() => location.route(`/shop/${shoppingEvent.Id}`)}
              >
                <ListItemIcon>
                  { shoppingEvent.Status === "COMPLETE" ? <CheckCircleIcon mr={1} /> : <PendingIcon mr={1} color="primary" /> }
                </ListItemIcon>
                <ListItemText
                  primary={<ShoppingEventSummary variant="primary" event={shoppingEvent} />}
                  secondary={shoppingEvent?.Status === "IN_PROGRESS"
                    ? "Shopping in Progress"
                    : <ShoppingEventSummary variant="secondary" event={shoppingEvent} />
                  }
                />
              </ListItem>
            )) }
          </List>
          { shoppingEvents && !shoppingEvents.length ? <EmptyListPlaceholder /> : null }
        </Container>
      }
      dialogs={() => null}
    />
  );
};

const EmptyListPlaceholder = () => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <Typography sx={{ mt: 1 }}>There are no shopping events to show.</Typography>
    <Typography sx={{ mt: 1 }}>
      <Link href="/shop/start">Start shopping</Link> to create your first event.
    </Typography>
  </Box>
);

