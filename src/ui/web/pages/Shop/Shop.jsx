import { useLocation } from 'preact-iso';
import { useState } from 'preact/hooks';

import Box from '@mui/material/Box';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import { CurrencyTextField } from '../../components/CurrencyTextField';
import { Header } from '../../components/Header.jsx';
import { useUpdatingState } from '../../hooks/useUpdatingState';
import { Page } from '../../components/Page';
import { Currency } from '../../components/Currency';
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
          <List>
            <ListItem divider>
              <ShoppingListGroup type="OTHER">
                <ShoppingList items={shoppingEvent?.list} showRequiredAmount={!historical} onListItemClick={onListItemClick} />
              </ShoppingListGroup>
            </ListItem>
            { historical ? null : (<>
              <Divider />
              <ListItem sx={{ mt: 1 }}>
                <Box display="flex" flexDirection="row">
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
