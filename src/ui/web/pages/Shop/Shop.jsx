import { useLocation } from 'preact-iso';
import { useState } from 'preact/hooks';

import Box from '@mui/material/Box';
import ChecklistIcon from '@mui/icons-material/Checklist';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { CurrencyTextField } from '../../components/CurrencyTextField';
import { Header } from '../../components/Header.jsx';
import { useUpdatingState } from '../../hooks/useUpdatingState';
import { Page } from '../../components/Page';
import { ShoppingListGroup } from './ShoppingListGroup';
import { ShoppingList } from './ShoppingList';
import { ShopPageHeader } from './ShopPageHeader';
import { HistoricalShopPageHeader } from './HistoricalShopPageHeader';

export function Shop({ core, shoppingEventId }) {
  const location = useLocation();
  const [totalSpent, setTotalSpent] = useState();
  const getShoppingEvent = () => {
    try {
      return core.getShoppingEvent(shoppingEventId);
    } catch(e) {
      if (e.code === "ResourceNotFound") {
        return null;
      }
      throw e;
    }
  };
  const [shoppingEvent, triggerUpdate] = useUpdatingState(false, getShoppingEvent);
  if (shoppingEvent === null) {
    location.route(`/history?eventNotFound=${shoppingEventId}`);
  }
  const historical = shoppingEvent?.description?.Status === "COMPLETE";

  const onListItemClick = item => {
    if (historical) {
      return;
    }
    core.buyItem(shoppingEventId, { ItemId: item.Id, Quantity: item.RequiredQuantity });
    triggerUpdate();
  };

  const groupedList = Object.values((shoppingEvent?.list || []).reduce((grouped, item) => {
    grouped[item.Type] = grouped[item.Type] || { type: item.Type, items: [] };
    grouped[item.Type].items.push(item);
    return grouped;
  }, {}));

  return (
    <Page
      isLoading={!shoppingEvent}
      header={!shoppingEvent
        ? <Header><ChecklistIcon sx={{ mr: 1 }} /></Header>
        : historical
          ? <HistoricalShopPageHeader shoppingEvent={shoppingEvent} />
          : <ShopPageHeader shoppingEvent={shoppingEvent} />
      }
      body={() =>
        <Container>
          <List sx={{ mt: -2 }}>
            { groupedList.map(itemGroup => (
              <ListItem divider key={itemGroup.type}>
                <ShoppingListGroup type={itemGroup.type} sx={{ mt: 2 }}>
                  <ShoppingList items={itemGroup.items} showRequiredAmount={!historical} onListItemClick={onListItemClick} />
                </ShoppingListGroup>
              </ListItem>
            )) }
            { historical ? null : (<>
              <ListItem sx={{ mt: 1 }}>
                <Box display="flex" flexDirection="row" mt={3} mb={4}>
                  <CurrencyTextField required sx={{ flex: 1 }} label="Total Spent" value={totalSpent} setValue={setTotalSpent} />
                  <Button
                    disabled={!Number(totalSpent) || Number.isNaN(Number(totalSpent))}
                    sx={{ margin: 'auto', flex: 1 }}
                    onClick={() => {
                      core.stopShopping(shoppingEventId, { TotalSpent: Number(totalSpent) });
                      location.route(`/history?activeEvent=${shoppingEventId}`);
                    }}
                  >Finish Shopping</Button>
                </Box>
              </ListItem>
            </>)}
          </List>
        </Container>
      }
      dialogs={() => null}
    />
  );
}
