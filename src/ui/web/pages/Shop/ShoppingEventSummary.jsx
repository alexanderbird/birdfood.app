import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { Currency } from '../../components/Currency';

export const ShoppingEventSummary = ({ event, variant }) => {
  if (!event) return null;
  const startedAt = new Date(Date.parse(event.StartedAt));
  if (variant === "oneline") {
    const formattedDate = startedAt.toLocaleDateString('en', {
      month: 'short',
      day: 'numeric'
    });
    return `${event.Store} on ${formattedDate}`;
  }
  if (variant === "primary") {
    const weekday = startedAt.toLocaleDateString('en', { weekday: 'long' });
    const dayOfMonth = startedAt.toLocaleDateString('en', { day: 'numeric' });
    const formattedTime = new Intl.DateTimeFormat("en", { timeStyle: "short" })
      .format(startedAt)
      .replace(/:\d\d/, '');
    return (
      <Box component="span" display="flex" flexDirection="row"
        sx={{
          width: 'fit-content',
          '& > *': {
            m: 0.5,
          },
        }}
        >
        <div>{dayOfMonth}</div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div>{weekday}</div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div>{formattedTime}</div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div>{event.Store}</div>
      </Box>
    );
  }
  throw new Error(`Unsupported variant "${variant}"`);
};
