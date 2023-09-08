import { useLocation } from 'preact-iso';
import { useState, useEffect } from 'preact/hooks';

import Box from '@mui/material/Box';
import ChecklistIcon from '@mui/icons-material/Checklist';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

import { CurrencyTextField } from '../../components/CurrencyTextField';
import { useUpdatingState } from '../../hooks/useUpdatingState';
import { useRecentShoppingEvents } from './useRecentShoppingEvents';
import { Header } from '../../components/Header.jsx';
import { Page } from '../../components/Page';

export function StartShopping({ core }) {
  const location = useLocation();
  const [shoppingEvents] = useRecentShoppingEvents(core);
  const [plan] = useUpdatingState(false, () => core.getShoppingPlan());

  const [formData, setFormData] = useState({ EstimatedTotal: 0, Store: "" });

  const ready = !!shoppingEvents && !!plan;

  const storeSuggestions = shoppingEvents && Array.from(new Set(
    shoppingEvents.map(x => x.Store)
  )).sort() || [];

  useEffect(() => {
    setFormData(current => ({ ...current, EstimatedTotal: plan?.total }));
  }, [plan?.total]);

  const isFormValid = !!(formData.EstimatedTotal && formData.Store);

  return (
    <Page
      isLoading={!ready}
      header={
        <Header>
          <ChecklistIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">Start Shopping</Typography>
        </Header>
      }
      body={() =>
        <Container>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& .MuiTextField-root': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <Autocomplete
              disablePortal
              freeSolo
              sx={{ mr: 2 }}
              value={formData.Store}
              options={storeSuggestions}
              onInputChange={((e, Store) => setFormData(current => ({ ...current, Store })))}
              renderInput={(params) => <TextField {...params} required label="Store" />}
            />
            <CurrencyTextField
              label="Estimate"
              required
              value={formData.EstimatedTotal}
              setValue={EstimatedTotal => setFormData(current => ({ ...current, EstimatedTotal }))}
            />
            <Button
              disabled={!isFormValid}
              variant="outlined"
              sx={{ margin: "auto", m: 1, width: 'auto' }}
              onClick={() => location.route(`/shop/${core.startShopping(formData).Id}`)}
            >Start Shopping</Button>
          </Box>
        </Container>
      }
      dialogs={() => null}
    />
  );
}
