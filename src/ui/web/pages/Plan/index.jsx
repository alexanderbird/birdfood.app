import Container from '@mui/material/Container';

import { Page } from '../../components/Page';
import { GroceryListForPlanning } from './GroceryListForPlanning';
import { PlanPageHeader } from './PlanPageHeader';
import { AutocompleteForPlanning } from './AutocompleteForPlanning';
import { usePlanState } from './usePlanState';

export function Plan({ core }) {
  const {
    cart,
    recentlyChangedItems,
    onItemsModified,
    GroceryItemEditFormDialogForPlan,
    ClearListDialogForPlan
  } = usePlanState(core);

  return (
    <Page
      header={<PlanPageHeader cartTotal={cart.total} />}
      body={
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
            openClearListDialog={ClearListDialogForPlan.open}
            openEditDialog={GroceryItemEditFormDialogForPlan.open}
          />
        </Container>
      }
      dialogs={<>
        <ClearListDialogForPlan itemsCount={cart.shoppingList.length} />
        <GroceryItemEditFormDialogForPlan />
      </>}
    />
  );
}
