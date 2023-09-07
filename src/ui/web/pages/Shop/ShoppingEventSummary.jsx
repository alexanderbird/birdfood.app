export const ShoppingEventSummary = ({ event }) => {
  if (!event) return null;
  const startedAt = new Date(Date.parse(event.StartedAt));
  const formattedDate = startedAt.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric' 
  });
  return formattedDate;
}

