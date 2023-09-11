import { useLocation } from 'preact-iso';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useDialogState } from '../../hooks/useDialogState';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { Header } from '../../components/Header.jsx';
import { Page } from '../../components/Page';
import { BirdFoodLogo } from '../../components/icons/BirdFoodLogo';

export function Landing({ setDataSource }) {
  const location = useLocation();
  const dialog = useDialogState();

  const onDialogConfirm = () => {
    setDataSource("demo");
    dialog.close();
    location.route('/plan');
  };

  return (
    <Page
      header={
        <Header noMenu>
          <Typography variant="h6" component="div" textAlign="center" width="100%">Welcome</Typography>
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
            <BirdFoodLogo sx={{ fontSize: 'min(500px, 70vw)', margin: 'auto' }} />
            <Button variant="outlined" disabled>Login</Button>
            <Button variant="outlined" disabled>Use device storage</Button>
            <Button variant="outlined" onClick={dialog.open} >Start Demo</Button>
          </Box>
        </Container>
      }
      dialogs={() => (
        <>
          <ConfirmDialog
            open={dialog.isOpen}
            onCancel={dialog.close}
            onConfirm={onDialogConfirm}
            titleText="Demo mode"
            confirmText="Got it"
          >
            All your changes will be reset when you refresh the page.
          </ConfirmDialog>
        </>
      )}
    />
  );
}
