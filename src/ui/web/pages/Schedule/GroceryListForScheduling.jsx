
import { GroceryItemList } from '../../components/GroceryItemList';

export const GroceryListForScheduling = ({ items,
  core,
  recentlyChangedItems,
  onItemsModified,
  openEditDialog,
  openRemoveItemDialog
}) => {

  const setQuantity = async (id, quantity, item) => {
    if (openRemoveItemDialog && item && (quantity <= 0)) {
      openRemoveItemDialog({ item: { ...item, RecurringQuantity: quantity } });
    } else {
      await core.updateItem({ Id: id, RecurringQuantity: quantity });
      onItemsModified(id);
    }
  };

  const updateQuantity = async (id, difference, item) => {
    if (openRemoveItemDialog && item && item.RecurringQuantity + difference <= 0) {
      openRemoveItemDialog({ item, difference });
    } else {
      await core.addToItemRecurringQuantity(id, difference);
      onItemsModified(id);
    }
  };

  return (
    <GroceryItemList items={items}
      getQuantityForItem={item => item.RecurringQuantity}
      recentlyChangedItems={recentlyChangedItems}
      updateQuantity={updateQuantity}
      setQuantity={setQuantity}
      doEdit={openEditDialog}
      actions={[]}
    />
  );
};

