import { useLocation } from 'preact-iso';
import { useState } from 'preact/hooks';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { ShoppingEventCache } from '../../../../core/ShoppingEventCache';
import { CurrencyTextField } from '../../components/CurrencyTextField';
import { Header } from '../../components/Header.jsx';
import { useMutableAsyncResource } from '../../hooks/useAsyncResource';
import { Page } from '../../components/Page';
import { ShoppingListGroup } from './ShoppingListGroup';
import { ShopPageHeader } from './ShopPageHeader';
import { HistoricalShopPageHeader } from './HistoricalShopPageHeader';

function updateTheFooterBadges(core) {
  core.getShoppingPlan();
}

export function Shop({ core, shoppingEventId }) {
  const location = useLocation();
  const [totalSpent, setTotalSpent] = useState();
  const getShoppingEvent = async () => {
    try {
      const [description, snapshot] = await Promise.all([
        core.getShoppingEvent(shoppingEventId),
        core.getShoppingEventSnapshot(shoppingEventId)
      ]);
      return { description, snapshot };
    } catch(e) {
      if (e.code === "ResourceNotFound") {
        return null;
      }
      throw e;
    }
  };
  const [shoppingEvent, setShoppingEvent] = useMutableAsyncResource(getShoppingEvent);
  if (shoppingEvent === null) {
    location.route(`/history?eventNotFound=${shoppingEventId}`);
  }
  const historical = shoppingEvent
    ? shoppingEvent.description?.Status === "COMPLETE"
    : location.url.startsWith('/history');
  if (shoppingEvent && historical && location.url.startsWith('/shop')) {
    location.route(`/history/${shoppingEventId}`);
  }
  if (shoppingEvent && !historical && location.url.startsWith('/history')) {
    location.route(`/shop/${shoppingEventId}`);
  }

  const cache = shoppingEvent?.snapshot && ShoppingEventCache.assemble(shoppingEvent.snapshot);
  const list = cache?.getList();
  const statistics = cache?.getStatistics();

  const updateItem = async attributes => {
    const id = `sei#${shoppingEventId}#${attributes.ItemId}`;
    if (historical) {
      return;
    }
    setShoppingEvent(current => {
      const newShoppingEventItems = [ ...current.snapshot.shoppingEventItems ];
      const existing = newShoppingEventItems.find(x => x.Id === id);
      if (existing) {
        Object.assign(existing, attributes);
      } else {
        newShoppingEventItems.push({ ...attributes, Id: id });
      }

      return { ...current, snapshot: { ...current.snapshot, shoppingEventItems: newShoppingEventItems } };
    });
    await core.buyItem(shoppingEventId, attributes);
  };

  const finishShopping = async () => {
    await core.stopShopping(shoppingEventId, { TotalSpent: Number(totalSpent) });
    updateTheFooterBadges(core);
    location.route(`/history?activeEvent=${shoppingEventId}`);
  };

  const groupedList = Object.values((list || []).reduce((grouped, item) => {
    grouped[item.Type] = grouped[item.Type] || { type: item.Type, items: [] };
    grouped[item.Type].items.push(item);
    return grouped;
  }, {}));

  return (
    <Page
      isLoading={!shoppingEvent}
      header={!shoppingEvent
        ? <Header />
        : historical
          ? <HistoricalShopPageHeader shoppingEvent={{ description: shoppingEvent.description, list, statistics }} />
          : <ShopPageHeader shoppingEvent={{ description: shoppingEvent.description, list, statistics }} />
      }
      body={() =>
        <Container>
          <List sx={{ mt: -2 }}>
            { groupedList.map(itemGroup => (
              <ListItem divider key={itemGroup.type}>
                <ShoppingListGroup
                  type={itemGroup.type}
                  items={itemGroup.items}
                  editable={!historical}
                  updateItem={updateItem}
                  sx={{ mt: 2 }}
                />
              </ListItem>
            )) }
            { historical ? null : (<>
              <ListItem sx={{ mt: 1 }}>
                <Box display="flex" flexDirection="row" mt={3} mb={4}>
                  <CurrencyTextField required sx={{ flex: 1 }} label="Total Spent" value={totalSpent} setValue={setTotalSpent} />
                  <Button
                    disabled={!Number(totalSpent) || Number.isNaN(Number(totalSpent))}
                    sx={{ margin: 'auto', flex: 1 }}
                    onClick={finishShopping}
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
