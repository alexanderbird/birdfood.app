import { useUpdatingState } from '../../hooks/useUpdatingState';

export function useLastYearShoppingEvents(core) {
  const listShoppingEvents = () => {
    core.getShoppingPlan();
    const to = new Date();
    to.setDate(to.getDate() + 1);
    const from = new Date();
    from.setYear(from.getFullYear() - 1);
    return core.listShoppingEvents(from, to);
  };
  return useUpdatingState(false, listShoppingEvents);
}
