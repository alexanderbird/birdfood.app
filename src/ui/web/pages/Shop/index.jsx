import { useLocation } from 'preact-iso';
import Container from '@mui/material/Container';
import { Header } from '../../components/Header.jsx';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useUpdatingState } from '../../hooks/useUpdatingState';

export const Shop = ({ core }) => {
  const listShoppingEvents = () => {
    const to = new Date();
    to.setDate(to.getDate() + 1);
    const from = new Date();
    from.setYear(from.getFullYear() - 1);
    return core.listShoppingEvents(from, to);
  };
  const [shoppingEvents, triggerUpdate] = useUpdatingState(false, listShoppingEvents);
  return (
    <>
      <Header>
        <CheckBoxIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">Buy some stuff</Typography>
      </Header>
      <Container maxWidth="sm">
        Coming soon
        { !shoppingEvents ? null : shoppingEvents.map(shoppingEvent => (
          <div>
            <pre>{ JSON.stringify(shoppingEvent, null, 2) }</pre>
            <Button disabled={shoppingEvent.Status === "COMPLETE"} onClick={() => { core.stopShopping(shoppingEvent.Id); triggerUpdate(); }}>Stop Shopping</Button>

          </div>
        )) }
        <Button onClick={() => { core.startShopping(); triggerUpdate(); }}>Start Shopping</Button>
      </Container>
    </>
  );
}
