import { useLocation } from 'preact-iso';
import { useState } from 'preact/hooks';

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
            { shoppingEvent?.list.map(item => (
              <ListItem key={item.Id} dense onClick={() => onListItemClick(item)}>
                <ListItemIcon>
                  { item.BoughtQuantity >= (item.RequiredQuantity || 0)
                    ? <CheckBoxIcon fontSize="large" />
                    : <CheckBoxOutlineBlankIcon fontSize="large" />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={ historical
                    ? `${item.BoughtQuantity} ${item.Name}`
                    : `${item.BoughtQuantity}/${item.RequiredQuantity} ${item.Name}`
                  }
                  secondary={<span><Currency>{item.UnitPriceEstimate || item.ActualUnitPrice}</Currency> each</span>} />
              </ListItem>
            ))}
            { historical ? null : (<>
              <Divider />
              <ListItem sx={{ mt: 1 }}>
                <CurrencyTextField required fullWidth label="Total Spent" value={totalSpent} setValue={setTotalSpent} />
              </ListItem>
              <ListItem>
                <Button
                  disabled={!Number(totalSpent) || Number.isNaN(Number(totalSpent))}
                  sx={{ margin: 'auto' }}
                  onClick={() => {
                    core.stopShopping(shoppingEventId, { TotalSpent: Number(totalSpent) });
                    location.route(`/history?activeEvent=${shoppingEventId}`);
                  }}
                >Finish Shopping</Button>
              </ListItem>
            </>)}
          </List>
        </Container>
      }
      dialogs={() => null}
    />
  );
}
