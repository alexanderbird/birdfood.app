
import { GroceryItemList } from '../../components/GroceryItemList';

export const GroceryListForScheduling = ({ items,
  core,
  recentlyChangedItems,
  onItemsModified,
  openEditDialog
}) => {

  const setQuantity = (id, quantity) => {
    core.updateItem({ Id: id, RecurringQuantity: quantity });
    onItemsModified(id);
  };

  const updateQuantity = (id, difference) => {
    core.addToItemRecurringQuantity(id, difference);
    onItemsModified(id);
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

