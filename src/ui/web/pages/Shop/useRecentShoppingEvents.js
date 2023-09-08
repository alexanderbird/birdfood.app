import { useUpdatingState } from '../../hooks/useUpdatingState';

export function useRecentShoppingEvents(core) {
  const listShoppingEvents = () => {
    const from = getFourMonthsAgo();
    const to = getTomorrow();
    return core.listShoppingEvents(from, to);
  };
  return useUpdatingState(false, listShoppingEvents);
}

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

function getFourMonthsAgo() {
  const date = new Date();
  date.setYear(date.getMonth() - 4);
  return date;
}
