import Container from '@mui/material/Container';

import { useScheduleState } from './useScheduleState';
import { Page } from '../../components/Page';
import { SchedulePageHeader } from './SchedulePageHeader';
import { AutocompleteForScheduling } from './AutocompleteForScheduling';
import { GroceryListForScheduling } from './GroceryListForScheduling';

export function Schedule({ core }) {
  const {
    cart,
    recentlyChangedItems,
    onItemsModified,
    GroceryItemEditFormDialogForSchedule
  } = useScheduleState(core);

  return (
    <Page
      isLoading={!cart}
      header={<SchedulePageHeader cartTotal={cart.total} />}
      body={() =>
        <Container>
          <AutocompleteForScheduling
            core={core}
            items={cart.all}
            onItemsModified={onItemsModified} />
          <GroceryListForScheduling
            core={core}
            items={cart.recurringItems}
            onItemsModified={onItemsModified}
            recentlyChangedItems={recentlyChangedItems}
            allowAddingRecurringItems={false}
            allowClearingTheList={false}
            openClearListDialog={() => null}
            openEditDialog={GroceryItemEditFormDialogForSchedule.open}
          />
        </Container>
      }
      dialogs={() => <>
        <GroceryItemEditFormDialogForSchedule />
      </>}
    />
  );
}
