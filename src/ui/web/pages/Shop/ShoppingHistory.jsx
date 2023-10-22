import { Fragment } from 'preact';
import { useLocation } from 'preact-iso';

import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import * as colors from '@mui/material/colors';

import { Currency } from '../../components/Currency';
import { useRecentShoppingEvents } from './useRecentShoppingEvents';
import { Page } from '../../components/Page';
import { ShoppingHistoryPageHeader } from './ShoppingHistoryPageHeader';
import { ShoppingEventSummary } from './ShoppingEventSummary';

function getWeekOfMonth(date) {
  const dateOfMonth = date.getDate();
  return Math.floor((dateOfMonth - 1) / 7);
}

function useRecentShoppingEventsGroupedMonthly(core) {
  const [shoppingEvents] = useRecentShoppingEvents(core);
  if (!shoppingEvents) return false;
  const groupedShoppingEvents = shoppingEvents.reverse().reduce((grouped, event) => {
    const date = new Date(Date.parse(event.StartedAt));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const group = `${year}-${month}`;
    const weekOfMonth = getWeekOfMonth(date);
    grouped[group] = grouped[group] || { group, date, total: 0, events: [], weeks: [] };
    grouped[group].events.push({ ...event, parsedDate: date });
    grouped[group].weeks[weekOfMonth] = grouped[group].weeks[weekOfMonth] || { weekOfMonth, total: 0 };
    const totalSpentNumber = (Number(event.TotalSpent) || 0);
    grouped[group].weeks[weekOfMonth].total += totalSpentNumber;
    grouped[group].total += totalSpentNumber;
    return grouped;
  }, {});
  return Object.values(groupedShoppingEvents).sort((lhs, rhs) => lhs.date < rhs.date ? 1 : -1);
}

const weekNumberWord = weekNumber => ['One', 'Two', 'Three', 'Four', 'Five'][weekNumber];

export const ShoppingHistory = ({ core }) => {
  const location = useLocation();
  const { eventNotFound, activeEvent } = location.query;

  const shoppingEvents = useRecentShoppingEventsGroupedMonthly(core);

  return (
    <Page
      isLoading={!shoppingEvents}
      header={<ShoppingHistoryPageHeader />}
      body={() =>
        <Container>
          { !eventNotFound ? null : <Alert severity="error">There is no shopping event with ID "{eventNotFound}"</Alert> }
          <List>
            { !shoppingEvents ? null : shoppingEvents.map(group => (
              <ListItem key={group.group} flexDirection="column" divider><Box width="100%">
                <Typography variant="h6" mt={1} display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="inherit">{group.date.toLocaleString('default', { month: 'long', year: 'numeric' })}</Typography>
                  <Typography variant="inherit" sx={{ fontWeight: 'bold' }}> <Currency>{group.total}</Currency></Typography>
                </Typography>
                <List dense>
                  { group.events.sort((lhs, rhs) => lhs.StartedAt < rhs.StartedAt ? 1 : -1)
                    .map((shoppingEvent, i, sortedShoppingEvents) => (<Fragment key={shoppingEvent.Id}>
                      { (i === 0 || getWeekOfMonth(shoppingEvent.parsedDate) !== getWeekOfMonth(sortedShoppingEvents[i - 1].parsedDate))
                        ? [group.weeks[getWeekOfMonth(shoppingEvent.parsedDate)]].map(week => (
                          <Divider key={week.weekOfMonth} sx={{ color: colors.grey[500], mt: 1.5 }} textAlign="left">
                            <Box component="span">
                              <Box component="span">Week {weekNumberWord(week.weekOfMonth)}: </Box>
                              <Box component="span" sx={{ fontWeight: 'bold' }}><Currency >{week.total}</Currency></Box>
                            </Box>
                          </Divider>
                        ))
                        : null
                      }
                      <ListItem
                        disableGutters
                        sx={{ mx: -2, px: 2, width: 'auto' }}
                        selected={shoppingEvent.Status === "IN_PROGRESS" || shoppingEvent.Id === activeEvent}
                        onClick={() => location.route(`/history/${shoppingEvent.Id}`)}
                      >
                        <ListItemText primary={<ShoppingEventSummary variant="primary" event={shoppingEvent} />} />
                        <Box sx={{textAlign: 'right'}}>
                          { shoppingEvent?.Status === "IN_PROGRESS"
                            ? <Typography>In Progress</Typography>
                            : <Currency>{shoppingEvent.TotalSpent}</Currency>
                          }
                        </Box>
                      </ListItem>
                    </Fragment>)) }
                </List>
              </Box></ListItem>
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

