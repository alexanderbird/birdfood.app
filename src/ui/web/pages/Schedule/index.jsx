import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

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
    GroceryItemEditFormDialogForSchedule,
    ConfirmRemoveItemDialog,
  } = useScheduleState(core);

  return (
    <Page
      isLoading={!cart}
      header={<SchedulePageHeader cartTotal={cart?.totalOfRecurringItems || 0} />}
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
            openRemoveItemDialog={ConfirmRemoveItemDialog.open}
            openClearListDialog={() => null}
            openEditDialog={GroceryItemEditFormDialogForSchedule.open}
          />
        </Container>
      }
      dialogs={() => <>
        <GroceryItemEditFormDialogForSchedule />
        <ConfirmRemoveItemDialog titleText={() => "Confirm Item Removal"} confirmText={() => "Remove"}>
          {({ item }) => (
            <Typography component="span">Do you want to remove <Typography component="span" sx={{ fontWeight: 'bold'}}>{item.Name?.trim()}</Typography>?</Typography>
          )}
        </ConfirmRemoveItemDialog>
      </>}
    />
  );
}
