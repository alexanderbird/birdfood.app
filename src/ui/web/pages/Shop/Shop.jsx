import { useLocation } from 'preact-iso';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { useUpdatingState } from '../../hooks/useUpdatingState';
import { Page } from '../../components/Page';
import { Currency } from '../../components/Currency';
import { ShopPageHeader } from './ShopPageHeader';

export function Shop({ core, shoppingEventId }) {
  const location = useLocation();
  const getShoppingEvent = () => {
    try {
      return core.getShoppingEvent(shoppingEventId);
    } catch(e) {
      if (e.code === "ResourceNotFound") {
        return null;
      }
    }
  }
  const [shoppingEvent, triggerUpdate] = useUpdatingState(false, getShoppingEvent);
  if (shoppingEvent === null) {
    location.route('/shop?eventNotFound=' + shoppingEventId);
  }

  return (
    <Page
      isLoading={!shoppingEvent}
      header={<ShopPageHeader description={shoppingEvent?.description} />}
      body={() =>
        <Container>
          <List>
            { shoppingEvent?.list.map(item => (
              <ListItem dense onClick={() => { core.buyItem(shoppingEventId, { ItemId: item.Id, Quantity: item.RequiredQuantity }); triggerUpdate(); }}>
                <ListItemIcon>
                  { item.BoughtQuantity >= item.RequiredQuantity
                    ? <CheckBoxIcon fontSize="large"/>
                    : <CheckBoxOutlineBlankIcon fontSize="large" />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={`${item.BoughtQuantity}/${item.RequiredQuantity} ${item.Name}`}
                  secondary={<Currency>{item.UnitPriceEstimate}</Currency>}/>
              </ListItem>
            ))}
            <ListItem>
              <Button sx={{ margin: 'auto' }} onClick={() => { core.stopShopping(shoppingEventId); location.route('/shop'); }}>Finish Shopping</Button>
            </ListItem>
          </List>
        </Container>
      }
      dialogs={() => null}
    />
  );
}

const scratch = () => {
                  <Button
                    disabled={shoppingEvent.Status === "COMPLETE"}
                    onClick={() => { core.stopShopping(shoppingEvent.Id); triggerUpdate(); }}
                  >Stop Shopping</Button>
}
