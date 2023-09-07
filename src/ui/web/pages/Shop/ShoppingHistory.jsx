import { useLocation } from 'preact-iso';

import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { useUpdatingState } from '../../hooks/useUpdatingState';
import { Header } from '../../components/Header.jsx';
import { Page } from '../../components/Page';
import { ShoppingHistoryPageHeader } from './ShoppingHistoryPageHeader';
import { ShoppingEventSummary } from './ShoppingEventSummary';

export const ShoppingHistory = ({ core }) => {
  const location = useLocation();
  const { eventNotFound } = location.query;

  const listShoppingEvents = () => {
    core.getShoppingPlan();
    const to = new Date();
    to.setDate(to.getDate() + 1);
    const from = new Date();
    from.setYear(from.getFullYear() - 1);
    return core.listShoppingEvents(from, to);
  };
  const [shoppingEvents, triggerUpdate] = useUpdatingState(false, listShoppingEvents);
  return (
    <Page
      isLoading={!shoppingEvents}
      header={<ShoppingHistoryPageHeader />}
      body={() =>
        <Container>
          { !eventNotFound ? null : <Alert severity="error">There is no shopping event with ID {eventNotFound}</Alert> }
          <List dense>
            <ListItem>
              <Button disabled={!!shoppingEvents.find(x => x.Status === "IN_PROGRESS")} sx={{ margin: "auto" }} onClick={() => location.route('/shop/' + core.startShopping().Id)}>Start Shopping</Button>
            </ListItem>
            { !shoppingEvents ? null : shoppingEvents.reverse().map(shoppingEvent => (
              <ListItem selected={shoppingEvent.Status === "IN_PROGRESS"}>
                <ListItemIcon>
                  { shoppingEvent.Status === "COMPLETE" ? <CheckCircleIcon mr={1} /> : <PendingIcon mr={1} color="primary" /> }
                </ListItemIcon>
                <ListItemText primary={ <ShoppingEventSummary event={shoppingEvent} />} />
                <ListItemButton>
                  <Link
                    disabled={shoppingEvent.Status === "COMPLETE"}
                    onClick={() => location.route('/shop/' + shoppingEvent.Id)}
                  >View</Link>
                </ListItemButton>

              </ListItem>
            )) }
          </List>
        </Container>
      }
      dialogs={() => null}
    />
  );
}
