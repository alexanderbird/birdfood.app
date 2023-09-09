import { useLocation } from 'preact-iso';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Header } from '../../components/Header.jsx';
import { Page } from '../../components/Page';
import { BirdFoodLogo } from '../../components/icons/BirdFoodLogo';
import { BirdFoodIcon } from '../../components/icons/BirdFoodIcon';

export function Landing() {
  const location = useLocation();

  return (
    <Page
      header={
        <Header>
          <BirdFoodIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" textAlign="center" width="100%">Welcome to Bird Food</Typography>
        </Header>
      }
      body={() =>
        <Container mt={2}>
          <Box display="flex" flexDirection="column" justifyContent="space-around" alignItems="center"
            sx={{
              minHeight: '70vh',
              '& > .MuiButton-root': {
                fontSize: '1.2em',
                width: '100%',
                mb: 3
              }
            }}>
            <BirdFoodLogo sx={{ fontSize: '80vw', margin: 'auto' }} />
            <Button variant="outlined" disabled>Login</Button>
            <Button variant="outlined" disabled>Use device storage</Button>
            <Button variant="outlined" onClick={() => location.route('/plan')} >Start Demo</Button>
          </Box>
        </Container>
      }
      dialogs={() => null}
    />
  );
}
