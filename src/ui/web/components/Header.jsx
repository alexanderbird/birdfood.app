import { useLocation } from 'preact-iso';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export function Header() {
  const { url } = useLocation();
  const title = {
    '/search': 'Search for items',
    '/plan': 'Plan the next shop',
    '/shop': 'Buy some stuff'
  }[url];
  const Icon = {
    '/search': SearchIcon,
    '/plan': ShoppingCartIcon,
    '/shop': CheckBoxIcon
  }[url] || (() => null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Icon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            { title }
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

