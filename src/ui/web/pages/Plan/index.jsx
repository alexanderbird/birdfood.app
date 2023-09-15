import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { usePlanState } from './usePlanState';
import { Page } from '../../components/Page';
import { PlanPageHeader } from './PlanPageHeader';
import { AutocompleteForPlanning } from './AutocompleteForPlanning';
import { GroceryListForPlanning } from './GroceryListForPlanning';

export function Plan({ core }) {
  const {
    cart,
    recentlyChangedItems,
    onItemsModified,
    GroceryItemEditFormDialogForPlan,
    ClearListDialogForPlan,
    ConfirmRemoveItemDialog,
  } = usePlanState(core);

  return (
    <Page
      isLoading={!cart}
      header={<PlanPageHeader cartTotal={cart?.total || 0} />}
      body={() => 
        <Container>
          <AutocompleteForPlanning
            core={core}
            items={cart.all}
            onItemsModified={onItemsModified} />
          <GroceryListForPlanning
            core={core}
            items={cart.shoppingList}
            onItemsModified={onItemsModified}
            recentlyChangedItems={recentlyChangedItems}
            allowAddingRecurringItems={cart.recurringItemsToAdd.length > 0}
            allowClearingTheList={cart.shoppingList.length}
            openRemoveItemDialog={ConfirmRemoveItemDialog.open}
            openClearListDialog={ClearListDialogForPlan.open}
            openEditDialog={GroceryItemEditFormDialogForPlan.open}
          />
        </Container>
      }
      dialogs={() => <>
        <ClearListDialogForPlan itemsCount={cart.shoppingList.length} />
        <GroceryItemEditFormDialogForPlan />
        <ConfirmRemoveItemDialog titleText={() => "Confirm Item Removal"} confirmText={() => "Remove"}>
          {({ item }) => (
            <Typography component="span">Do you want to remove <Typography component="span" sx={{ fontWeight: 'bold'}}>{item.Name?.trim()}</Typography>?</Typography>
          )}
        </ConfirmRemoveItemDialog>
      </>}
    />
  );
}
