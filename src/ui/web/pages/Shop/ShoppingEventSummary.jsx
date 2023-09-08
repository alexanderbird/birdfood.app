import Typography from '@mui/material/Typography';

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
    const formattedDate = startedAt.toLocaleDateString('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    return formattedDate;
  }
  if (variant === "secondary") {
    const formattedTime = new Intl.DateTimeFormat("en", { timeStyle: "short" })
      .format(startedAt)
      .replace(/:\d\d/, '');
    return (
      <Typography component="span">
        <Currency>{event.TotalSpent}</Currency>
        <span>  |  </span>
        {event.Store}
        <span>  |  </span>
        {formattedTime}
      </Typography>
    );
  }
  throw new Error(`Unsupported variant "${variant}"`);
};

