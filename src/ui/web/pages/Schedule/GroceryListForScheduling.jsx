
import { GroceryItemList } from '../../components/GroceryItemList';

export const GroceryListForScheduling = ({ items,
  core,
  recentlyChangedItems,
  onItemsModified,
  openEditDialog
}) => {

  const setQuantity = async (id, quantity) => {
    await core.updateItem({ Id: id, RecurringQuantity: quantity });
    onItemsModified(id);
  };

  const updateQuantity = async (id, difference) => {
    await core.addToItemRecurringQuantity(id, difference);
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

