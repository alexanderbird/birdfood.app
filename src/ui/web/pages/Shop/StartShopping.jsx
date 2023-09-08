import { useLocation } from 'preact-iso';

import Box from '@mui/material/Box';
import CheckListIcon from '@mui/icons-material/CheckList';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import { Header } from '../../components/Header.jsx';
import { Page } from '../../components/Page';

export function StartShopping({ core }) {
  const location = useLocation();

  return (
    <Page
      header={
        <Header>
          <CheckListIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">Start Shopping</Typography>
        </Header>
      }
      body={() =>
        <Container>
          <Box display="flex" justifyContent="space-around">
            <Button
              variant="outlined"
              sx={{ margin: "auto" }}
              onClick={() => location.route(`/shop/${core.startShopping().Id}`)}
            >Start Shopping</Button>
          </Box>
        </Container>
      }
      dialogs={() => null}
    />
  );
}
